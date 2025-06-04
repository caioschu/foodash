/*
  # Add sales channel fees configuration

  1. Changes
    - Update sales_channels column in restaurant_profiles to include fees configuration
    - Add fees structure for commission, anticipation, and online payment options

  2. Security
    - Maintain existing RLS policies
*/

-- Update sales_channels column to include fees configuration
ALTER TABLE restaurant_profiles
ALTER COLUMN sales_channels SET DEFAULT '[
  {
    "id": "salao",
    "name": "Salão",
    "enabled": true,
    "fees": {
      "commission": 0,
      "onlinePayment": {
        "credit": 0,
        "debit": 0,
        "pix": 0,
        "food_voucher": 0,
        "enabled": false
      }
    }
  },
  {
    "id": "ifood",
    "name": "iFood",
    "enabled": false,
    "fees": {
      "commission": 12,
      "anticipation": 2.5,
      "onlinePayment": {
        "credit": 3.5,
        "debit": 2.5,
        "pix": 1,
        "food_voucher": 3.5,
        "enabled": true
      }
    }
  },
  {
    "id": "rappi",
    "name": "Rappi",
    "enabled": false,
    "fees": {
      "commission": 12,
      "anticipation": 2,
      "onlinePayment": {
        "credit": 3.5,
        "debit": 2.5,
        "pix": 1,
        "food_voucher": 3.5,
        "enabled": true
      }
    }
  },
  {
    "id": "whatsapp",
    "name": "WhatsApp",
    "enabled": false,
    "fees": {
      "commission": 0,
      "onlinePayment": {
        "credit": 0,
        "debit": 0,
        "pix": 0,
        "food_voucher": 0,
        "enabled": false
      }
    }
  },
  {
    "id": "delivery",
    "name": "Delivery Direto",
    "enabled": false,
    "fees": {
      "commission": 0,
      "onlinePayment": {
        "credit": 0,
        "debit": 0,
        "pix": 0,
        "food_voucher": 0,
        "enabled": false
      }
    }
  }
]'::jsonb;