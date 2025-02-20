import http from "./httpService";

const apiEndpoint = "";
// const apiEndpoint = "/stripe";

// =====|  Stripe Service  |=====

const StripeService = {
	createPaymentIntent: () => http.post(`${apiEndpoint}/create-payment-intent`),
};

// =====|  APIs  |=====

export const createPaymentIntent = () => {
	return StripeService.createPaymentIntent();
};
