process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

const app = express();

app.use(cors());
app.use(express.json());

// =====================================
// SUPABASE
// =====================================

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;

const supabaseKey =
  process.env.SUPABASE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error("Supabase URL is missing in .env");
}

if (!supabaseKey) {
  throw new Error("Supabase key is missing in .env");
}

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

console.log("✅ Supabase connected");

// =====================================
// RAZORPAY
// =====================================

if (
  !process.env.RAZORPAY_KEY_ID ||
  !process.env.RAZORPAY_KEY_SECRET
) {
  console.warn(
    "⚠️ Razorpay keys are missing in .env"
  );
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================================
// HEALTH CHECK
// =====================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "YNR Events API is running",
  });
});

// =====================================
// CREATE ENQUIRY
// =====================================

app.post("/api/enquiries", async (req, res) => {
  try {
    console.log("📩 New enquiry:", req.body);

    const {
      name,
      phone,
      email,
      event_type,
      event_date,
      guests,
      location,
      message,
    } = req.body;

    if (!name || !phone || !event_type) {
      return res.status(400).json({
        success: false,
        message:
          "Name, phone and event type are required.",
      });
    }

    const { data, error } = await supabase
      .from("enquiries")
      .insert([
        {
          name,
          phone,
          email: email || null,
          event_type,
          event_date: event_date || null,
          guests: guests
            ? Number(guests)
            : null,
          location: location || null,
          message: message || null,
          status: "New",
          payment_status: "Pending",
          payment_amount: 0,
          payment_id: null,
          payment_order_id: null,
        },
      ])
      .select();

    if (error) {
      console.error(
        "❌ Supabase error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    console.log("✅ Enquiry saved:", data);

    return res.status(201).json({
      success: true,
      message:
        "Enquiry submitted successfully!",
      data,
    });
  } catch (error) {
    console.error(
      "❌ Enquiry error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit enquiry.",
    });
  }
});

// =====================================
// GET ALL ENQUIRIES
// =====================================

app.get("/api/enquiries", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("id", {
        ascending: false,
      });

    if (error) {
      console.error(
        "❌ Fetch enquiries error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(
      "❌ Fetch error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch enquiries.",
    });
  }
});

// =====================================
// GET SINGLE ENQUIRY
// =====================================

app.get(
  "/api/enquiries/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      const { data, error } =
        await supabase
          .from("enquiries")
          .select("*")
          .eq("id", id)
          .maybeSingle();

      if (error) {
        console.error(
          "❌ Get enquiry error:",
          error
        );

        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Enquiry not found.",
        });
      }

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch enquiry.",
      });
    }
  }
);

// =====================================
// UPDATE ENQUIRY STATUS
// =====================================

app.patch(
  "/api/enquiries/:id",
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      console.log(
        "🔄 Updating enquiry:",
        id,
        status
      );

      const allowedStatuses = [
        "New",
        "Contacted",
        "Confirmed",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status.",
        });
      }

      const { data, error } =
        await supabase
          .from("enquiries")
          .update({ status })
          .eq("id", id)
          .select()
          .maybeSingle();

      if (error) {
        console.error(
          "❌ Status update error:",
          error
        );

        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      if (!data) {
        console.error(
          "❌ No enquiry found with ID:",
          id
        );

        return res.status(404).json({
          success: false,
          message: "Enquiry not found.",
        });
      }

      console.log(
        "✅ Status updated:",
        data
      );

      return res.json({
        success: true,
        message:
          "Enquiry status updated.",
        data,
      });
    } catch (error) {
      console.error(
        "❌ Status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update enquiry.",
      });
    }
  }
);

// =====================================
// DELETE ENQUIRY
// =====================================

app.delete(
  "/api/enquiries/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      console.log(
        "🗑️ Deleting enquiry:",
        id
      );

      const { data, error } =
        await supabase
          .from("enquiries")
          .delete()
          .eq("id", id)
          .select()
          .maybeSingle();

      if (error) {
        console.error(
          "❌ Delete error:",
          error
        );

        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      if (!data) {
        console.error(
          "❌ No enquiry found with ID:",
          id
        );

        return res.status(404).json({
          success: false,
          message: "Enquiry not found.",
        });
      }

      console.log(
        "✅ Enquiry deleted:",
        id
      );

      return res.json({
        success: true,
        message:
          "Enquiry deleted successfully.",
        data,
      });
    } catch (error) {
      console.error(
        "❌ Delete error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete enquiry.",
      });
    }
  }
);

// =====================================
// CREATE RAZORPAY ORDER
// =====================================

app.post(
  "/api/payments/create-order",
  async (req, res) => {
    try {
      const {
        enquiryId,
        amount,
      } = req.body;

      console.log(
        "💳 Creating payment order:",
        enquiryId,
        amount
      );

      if (!enquiryId || !amount) {
        return res.status(400).json({
          success: false,
          message:
            "Enquiry ID and amount are required.",
        });
      }

      if (
        !process.env.RAZORPAY_KEY_ID ||
        !process.env.RAZORPAY_KEY_SECRET
      ) {
        return res.status(500).json({
          success: false,
          message:
            "Razorpay keys are missing.",
        });
      }

      const numericAmount =
        Number(amount);

      if (
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment amount.",
        });
      }

      // Check enquiry exists
      const { data: enquiry, error: enquiryError } =
        await supabase
          .from("enquiries")
          .select("id, name")
          .eq("id", enquiryId)
          .maybeSingle();

      if (enquiryError) {
        console.error(
          "❌ Enquiry lookup error:",
          enquiryError
        );

        return res.status(500).json({
          success: false,
          message:
            enquiryError.message,
        });
      }

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: "Enquiry not found.",
        });
      }

      const amountInPaise =
        Math.round(
          numericAmount * 100
        );

      const order =
        await razorpay.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt:
            `ynr_${enquiryId}_${Date.now()}`,
          notes: {
            enquiry_id:
              String(enquiryId),
            customer:
              enquiry.name || "",
          },
        });

      const { error: updateError } =
        await supabase
          .from("enquiries")
          .update({
            payment_order_id:
              order.id,
            payment_amount:
              numericAmount,
            payment_status:
              "Pending",
          })
          .eq("id", enquiryId);

      if (updateError) {
        console.error(
          "❌ Payment DB update error:",
          updateError
        );

        return res.status(500).json({
          success: false,
          message:
            updateError.message,
        });
      }

      console.log(
        "✅ Razorpay order created:",
        order.id
      );

      return res.json({
        success: true,
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId:
            process.env
              .RAZORPAY_KEY_ID,
        },
      });
    } catch (error) {
      console.error(
        "❌ Create Razorpay order error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error?.error?.description ||
          error?.message ||
          "Unable to create payment order.",
      });
    }
  }
);

// =====================================
// VERIFY RAZORPAY PAYMENT
// =====================================

app.post(
  "/api/payments/verify",
  async (req, res) => {
    try {
      const {
        enquiryId,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      } = req.body;

      console.log(
        "🔐 Verifying payment:",
        enquiryId
      );

      if (
        !enquiryId ||
        !razorpay_payment_id ||
        !razorpay_order_id ||
        !razorpay_signature
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment verification data is incomplete.",
        });
      }

      // Get trusted order ID from database
      const {
        data: enquiry,
        error: enquiryError,
      } = await supabase
        .from("enquiries")
        .select(
          "id, payment_order_id"
        )
        .eq("id", enquiryId)
        .maybeSingle();

      if (enquiryError) {
        console.error(
          "❌ Enquiry lookup error:",
          enquiryError
        );

        return res.status(500).json({
          success: false,
          message:
            enquiryError.message,
        });
      }

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message:
            "Enquiry not found.",
        });
      }

      if (
        enquiry.payment_order_id !==
        razorpay_order_id
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment order does not match.",
        });
      }

      const signaturePayload =
        `${enquiry.payment_order_id}|${razorpay_payment_id}`;

      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_KEY_SECRET
          )
          .update(signaturePayload)
          .digest("hex");

      const expectedBuffer =
        Buffer.from(
          expectedSignature,
          "utf8"
        );

      const receivedBuffer =
        Buffer.from(
          razorpay_signature,
          "utf8"
        );

      if (
        expectedBuffer.length !==
        receivedBuffer.length
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment signature.",
        });
      }

      const isValid =
        crypto.timingSafeEqual(
          expectedBuffer,
          receivedBuffer
        );

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment signature.",
        });
      }

      const {
        data,
        error,
      } = await supabase
        .from("enquiries")
        .update({
          payment_status: "Paid",
          payment_id:
            razorpay_payment_id,
          payment_order_id:
            razorpay_order_id,
        })
        .eq("id", enquiryId)
        .select()
        .maybeSingle();

      if (error) {
        console.error(
          "❌ Payment save error:",
          error
        );

        return res.status(500).json({
          success: false,
          message:
            error.message,
        });
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message:
            "Enquiry could not be updated.",
        });
      }

      console.log(
        "✅ Payment verified:",
        razorpay_payment_id
      );

      return res.json({
        success: true,
        message:
          "Payment verified successfully.",
        data,
      });
    } catch (error) {
      console.error(
        "❌ Payment verification error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to verify payment.",
      });
    }
  }
);

// =====================================
// SERVER
// =====================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 YNR Events server running on port ${PORT}`
  );
});