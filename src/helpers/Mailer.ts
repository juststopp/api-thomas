import nodemailer from "nodemailer";

class Mailer {
	subject: string;

	private _transporter: nodemailer.Transporter;
	constructor(subject: string) {
		this.subject = subject;

		this._transporter = nodemailer.createTransport({
			service: process.env.EMAIL_SENDER_SERVICE,
			auth: {
				user: process.env.EMAIL_SENDER_USER,
				pass: process.env.EMAIL_SENDER_PASS,
			},
		});
	}

	send(to: string, message: string) {
		this._transporter.sendMail({
			from:
				process.env.EMAIL_SENDER_NAME +
				"<" +
				process.env.EMAIL_SENDER_USER +
				">",
			to: to,
			subject: this.subject,
			html: `
			<!DOCTYPE html>
			<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
				<head>
					<title></title>

					<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
					<meta name="viewport" content="width=device-width,initial-scale=1">
					
					<!--[if mso]>
						<xml>
							<o:OfficeDocumentSettings>
								<o:PixelsPerInch>96</o:PixelsPerInch>
								<o:AllowPNG/>
							</o:OfficeDocumentSettings>
						</xml>
					<![endif]-->
					
					<style>
						*{box-sizing:border-box}body{margin:0;padding:0}a[x-apple-data-detectors]{color:inherit!important;text-decoration:inherit!important}#MessageViewBody a{color:inherit;text-decoration:none}p{line-height:inherit}.desktop_hide,.desktop_hide table{mso-hide:all;display:none;max-height:0;overflow:hidden}.image_block img+div{display:none} @media (max-width:720px){.mobile_hide{display:none}.row-content{width:100%!important}.stack .column{width:100%;display:block}.mobile_hide{min-height:0;max-height:0;max-width:0;overflow:hidden;font-size:0}.desktop_hide,.desktop_hide table{display:table!important;max-height:none!important}}
					</style>
				</head>
				<body style="background-color:#fff;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none">
					<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#fff"><tbody><tr><td><table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:700px;margin:0 auto" width="700"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:20px;padding-top:30px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad" style="width:100%"><div class="alignment" align="center" style="line-height:10px"><div style="max-width:700px"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/0db9f180-d222-4b2b-9371-cf9393bf4764/0bd8b69e-4024-4f26-9010-6e2a146401fb/LOGO_Demeter-JPEG.jpg" style="display:block;height:auto;border:0;width:100%" width="700"></div></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#4a65ad;background-image:url(https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/0db9f180-d222-4b2b-9371-cf9393bf4764/a31367d3-56d9-4984-bf48-79331695a0bc/galaxy-bg.png);background-position:top center;background-repeat:no-repeat"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:700px;margin:0 auto" width="700"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-top:40px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="text_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:30px"><div style="font-family:sans-serif"><div class style="font-size:12px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;mso-line-height-alt:14.399999999999999px;color:#fff;line-height:1.2"><p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px"><span style="font-size:30px"><strong>${this.subject}</strong></span></p></div></div></td></tr></table><table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px"><div style="font-family:sans-serif"><div class style="font-size:12px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;mso-line-height-alt:18px;color:#d8ebf8;line-height:1.5"><p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:21px"><span style><span style>${message}</span></span></p></div></div></td></tr></table><table class="button_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tr><td class="pad" style="padding-bottom:50px;padding-left:10px;padding-right:10px;padding-top:30px;text-align:center"><div class="alignment" align="center"><!--[if mso]>
					
					<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://demeter-im.com" style="height:48px;width:233px;v-text-anchor:middle;" arcsize="63%" stroke="false" fillcolor="#3AAEE0">
					<w:anchorlock/>
					<v:textbox inset="0px,0px,0px,0px">
					
					<center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px">
					
					<![endif]--><a href="https://demeter.im" target="_blank" style="text-decoration:none;display:inline-block;color:#fff;background-color:#3aaee0;border-radius:30px;width:auto;border-top:0 solid transparent;font-weight:undefined;border-right:0 solid transparent;border-bottom:0 solid transparent;border-left:0 solid transparent;padding-top:8px;padding-bottom:8px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all"><span style="padding-left:40px;padding-right:40px;font-size:16px;display:inline-block;letter-spacing:normal"><span style="word-break:break-word;line-height:32px"><strong>Notre site web</strong></span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><!-- End --><div style="background-color:transparent;">
						<div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
							<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
								<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->
								<!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:15px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
								<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
							</div>
						</div>
					</div>
				</body>
			</html>
			`,
		});
	}
}

export default Mailer;
