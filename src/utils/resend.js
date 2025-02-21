import { Resend } from "resend";
import { config } from "dotenv";

config();
const resend = new Resend(process.env.RESEND_API_KEY);
export const sendEmail = async (from, to, subject, html) => {
    try {
      const response = await resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      return response;
    }
    catch(error){
        console.log("error",error)
    }
    };