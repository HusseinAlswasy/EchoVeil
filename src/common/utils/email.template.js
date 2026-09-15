
export const emailTemplate = ({ firstName, email, otp}) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirm your subscription — EchoVeil</title>
    </head>
    <body style="margin:0; padding:0; background-color:#0f1115; font-family:'Segoe UI', Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f1115; padding:40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#161a22; border-radius:12px; overflow:hidden; border:1px solid #262b36;">
    
              <!-- Header -->
              <tr>
                <td style="padding:32px 32px 16px 32px; text-align:center;">
                  <div style="display:inline-block; width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg,#6c5ce7,#00cec9); margin-bottom:12px;"></div>
                  <h1 style="margin:0; color:#ffffff; font-size:22px; letter-spacing:0.5px;">EchoVeil</h1>
                  <p style="margin:4px 0 0 0; color:#8a90a2; font-size:13px;">Confirm your subscription</p>
                </td>
              </tr>
    
              <!-- Body -->
              <tr>
                <td style="padding:8px 32px 24px 32px; color:#c7cbd6; font-size:15px; line-height:1.6;">
                  <p>Hi ${firstName},</p>
                  <p>
                    You're one step away from receiving updates from <strong>EchoVeil</strong>.
                    Please confirm that <strong>${email}</strong> should be opted in. Your OTP is <strong>${otp}</strong> and this keeps our list clean and consent-based.
                  </p>
                </td>
              </tr>     
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`
};