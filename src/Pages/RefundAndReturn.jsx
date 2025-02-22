const RefundAndReturn = () => {
  return (
    <div className="flex items-center justify-between w-[95%] lg:w-[90%] mx-auto py-2.5">
      <div className="max-w-4xl lg:max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Cancellation and Refund Policy for Rento Bikes
        </h1>

        <p className="text-gray-700 mb-6">
          At Rento Bikes, we aim to provide a seamless and hassle-free bike
          rental experience. However, we understand that plans can change. Our
          cancellation and refund policy ensures clarity and fairness for all
          customers. Please read the policy carefully before making a booking.
        </p>

        <hr className="border-gray-300 mb-6" />

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          1. Cancellation Policy
        </h2>

        <h3 className="font-semibold text-gray-900 mb-2">
          Cancellation by Customer:
        </h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>
            <strong>24 Hours Before Pickup:</strong> If you cancel your booking
            more than 24 hours before the scheduled pickup time, you will
            receive a full refund.
          </li>
          <li>
            <strong>Less Than 24 Hours Before Pickup:</strong> Cancellations
            made within 24 hours of the pickup time will incur a cancellation
            fee of 25% of the booking amount. The remaining amount will be
            refunded.
          </li>
          <li>
            <strong>No-Show or Failure to Pick Up:</strong> If you fail to pick
            up the bike at the scheduled time without prior cancellation, no
            refund will be provided.
          </li>
        </ul>

        <h3 className="font-semibold text-gray-900 mb-2">
          Cancellation by Rento Bikes:
        </h3>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>
            In rare cases where Rento Bikes must cancel your booking due to
            unforeseen circumstances (e.g., bike unavailability, technical
            issues), you will receive a full refund or the option to reschedule
            without additional charges.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          2. Refund Policy
        </h2>

        <h3 className="font-semibold text-gray-900 mb-2">Refund Processing:</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>
            Refunds will be initiated within <strong>5-7 business days</strong>{" "}
            of the cancellation request being approved.
          </li>
          <li>
            Refunds will be credited back to the original payment method used
            during booking <strong>5-7 business days</strong>.
          </li>
        </ul>

        <h3 className="font-semibold text-gray-900 mb-2">
          Refund for Early Return:
        </h3>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>
            If you choose to return the bike before the end of the rental
            period, no refund will be provided for the unused hours or days.
          </li>
        </ul>

        <h3 className="font-semibold text-gray-900 mb-2">
          Refund for Security Deposit:
        </h3>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>
            The security deposit (if applicable) will be refunded within{" "}
            <strong>2-3 business days</strong> of the bike's return, provided
            there is no damage, late return, or violation of rental terms.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          3. Rescheduling Policy
        </h2>

        <h3 className="font-semibold text-gray-900 mb-2">Change of Dates:</h3>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>
            Rescheduling requests can be made up to{" "}
            <strong>12 hours before the pickup time</strong>, subject to bike
            availability.
          </li>
          <li>
            No additional charges will apply for the first rescheduling.
            Subsequent requests may incur a processing fee.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          4. Terms and Conditions
        </h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>
            All cancellations and refund requests must be initiated through the
            Rento Bikes website, app, or customer support.
          </li>
          <li>
            Refunds are subject to inspection of the bike upon return. Any
            damage, late return fees, or penalties will be deducted from the
            refund or deposit amount.
          </li>
          <li>
            In case of disputes, Rento Bikes reserves the right to make the
            final decision.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          5. Contact Us
        </h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>
            <strong>Email:</strong> support@rentobikes.com
          </li>
          <li>
            <strong>Phone:</strong> +91 8884488891
          </li>
          <li>
            <strong>Live Chat:</strong> Available on our website and app.
          </li>
        </ul>

        <p className="text-gray-700 text-lg">
          Rento Bikes strives to ensure customer satisfaction while maintaining
          a fair and transparent process. Thank you for choosing Rento Bikes for
          your bike rental needs!
        </p>
      </div>
    </div>
  );
};

export default RefundAndReturn;
