import { CreditCard } from "lucide-react";
import FeaturePage from "../components/FeaturePage";

function OrdersAndPayment() {
  return (
    <FeaturePage
      title="Orders & Payments"
      description="Reserve a stable home for order history, payouts, and payment settings."
      highlights={[
        "Separate transaction concerns from social activity cleanly.",
        "Use this area for invoices, payouts, receipts, or subscriptions later.",
        "Keep the route ship-ready without pretending the full billing system exists yet.",
      ]}
      icon={CreditCard}
    />
  );
}

export default OrdersAndPayment;
