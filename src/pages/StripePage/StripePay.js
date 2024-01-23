import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OSGJJSIUi6MuxALgyUwFVGJl6GIzS4X4fO1di91g2e3ASNPN0A8NI82LCvofcRRwCnbS3crcYO8oeSQg7a6ZqjZ00hktKw1kI');

export default function StripePay() {
  const options = {
    // passing the client secret obtained from the server
    clientSecret: '{{CLIENT_SECRET}}',
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};