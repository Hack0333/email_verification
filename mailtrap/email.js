import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE ,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE} from "./emailTemplate.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Verification email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email :", error.message);
    throw new Error("Error sending verification email :", error.message);
  }
};

export const sendWellcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
    //   subject: "Wellcome Email",
      template_uuid: "348d992a-4c6c-4ac9-9a79-c327ca0ca3f2",
      template_variables: {
        company_info_name: "Backend Company",
        name: {name},
        company_info_address: "Sitapur",
        company_info_city: "Jaipur",
        company_info_zip_code: "302022",
        company_info_country: "India",
      },
    //   category : "Wellcome Email"
    });

    console.log("wellcome email sent successfully", response);

  } catch (error) {
    console.error("Error sending wellcome email :", error.message);
    throw new Error("Error sending wellcome email :", error.message);
  }
};

export const sendForgotPasswordEmail = async (email, resetUrl) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from : sender,
            to : recipient,
            subject : "Forgot Password",
            html : PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetUrl}", resetUrl),
            category : "Forgot Password"
        })

        console.log("Forgot password email sent successfully", response);
    } catch (error) {
        console.error("Error sending forgot password email :", error.message);
        throw new Error("Error sending forgot password email :", error.message);
    }
}

export const sendPasswordResetSuccessEmail = async (email) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from : sender,
            to : recipient,
            subject : "Password Reset Success",
            html : PASSWORD_RESET_SUCCESS_TEMPLATE ,
            category : "Password Reset Success"
        })

        console.log("Password reset success email sent successfully", response);
    } catch (error) {
        console.error("Error sending password reset success email :", error.message);
        throw new Error("Error sending password reset success email :", error.message);
    }
}
