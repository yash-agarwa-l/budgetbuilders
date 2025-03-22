import axios from 'axios';

class OTPless {
  constructor() {
    this.clientId = process.env.OTPLESS_CLIENT_ID;
    this.clientSecret = process.env.OTPLESS_CLIENT_SECRET;
    this.baseURL = 'https://api.otpless.com/auth/otp';
  }

  async sendOTP(phoneNumber, channel = 'SMS', otpLength = 6, expiry = 90) {
    try {
      const response = await axios.post(
        `${this.baseURL}/send`,
        {
          phoneNumber: `91${phoneNumber}`,
          channel,
          otpLength,
          expiry,
        },
        {
          headers: {
            'client-id': this.clientId,
            'client-secret': this.clientSecret,
          },
        }
      );
      return { orderId: response.data.orderId };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  }

  async verifyOTP(orderId, otp, phoneNumber) {
    try {
      const response = await axios.post(
        `${this.baseURL}/verify`,
        {
          orderId,
          otp,
          phoneNumber: `91${phoneNumber}`,
        },
        {
          headers: {
            'client-id': this.clientId,
            'client-secret': this.clientSecret,
          },
        }
      );
      return { isOTPVerified: response.data.isOTPVerified };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  }
}

export default new OTPless();