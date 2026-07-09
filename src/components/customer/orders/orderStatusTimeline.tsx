import type { OrderStatus } from "@/lib/orders/getOrdersForAdmin";
import { TimelineRow, TimelineStep, ReturnBanner } from "./orders.styles";

// The pipeline is always these four fulfillment stages — 'refund_requested'
// isn't a fifth stage in the pipeline, it's a flag that can only be set once
// an order has already reached 'delivered' (see submitReturnRequest.ts,
// which requires status === 'delivered' before accepting a return request).
// So it's rendered as a banner below a fully-completed timeline instead of
// as its own step.
const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Order placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function stepIndex(status: OrderStatus): number {
  if (status === "refund_requested") return 3; // implies delivered
  return STEPS.findIndex((s) => s.key === status);
}

interface OrderStatusTimelineProps {
  status: OrderStatus;
}

const OrderStatusTimeline = ({ status }: OrderStatusTimelineProps) => {
  const currentIndex = stepIndex(status);

  return (
    <div>
      <TimelineRow>
        {STEPS.map((step, i) => (
          <TimelineStep
            key={step.key}
            $done={i <= currentIndex}
            $last={i === STEPS.length - 1}
          >
            {i < STEPS.length - 1 && <div className="line" />}
            <div className="dot">{i <= currentIndex ? "✓" : ""}</div>
            <div className="label">{step.label}</div>
          </TimelineStep>
        ))}
      </TimelineRow>

      {status === "refund_requested" && (
        <ReturnBanner>
          A return is currently in progress for this order.
        </ReturnBanner>
      )}
    </div>
  );
};

export default OrderStatusTimeline;
