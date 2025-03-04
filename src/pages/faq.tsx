import { Accordion } from "react-bootstrap";
import "../css/accordion.css";

export const FAQ = () => {
  return (
    <Accordion className="faq-accordion">
      <Accordion.Item eventKey="0">
        <Accordion.Header>What is OldPal?</Accordion.Header>
        <Accordion.Body>
          OldPal is a platform designed to help individuals and businesses stay
          connected in a structured and meaningful way. Whether you need to
          manage contacts, set reminders for follow-ups, or improve engagement
          with clients and friends, OldPal provides an intuitive interface to
          keep track of your relationships. Our mission is to ensure that you
          never lose touch with the important people in your life, both
          professionally and personally.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>How can I create an account?</Accordion.Header>
        <Accordion.Body>
          Creating an account on OldPal is simple:
          <ol>
            <li>
              Go to our homepage and click on the <b>"Sign Up"</b> button.
            </li>
            <li>Fill in your details such as name, email, and password.</li>
            <li>
              You will receive a verification email; click the link in the email
              to activate your account.
            </li>
            <li>Once verified, log in and start managing your connections.</li>
          </ol>
          We also offer a Google sign-in option for a faster signup process.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Is my data secure on Reconnect?</Accordion.Header>
        <Accordion.Body>
          Yes! At OldPal, we prioritize user privacy and data security. Here’s
          how we protect your information:
          <ul>
            <li>
              <b>Encryption:</b> All user data is encrypted both in transit and
              at rest.
            </li>
            <li>
              <b>Secure Authentication:</b> We use industry-standard
              authentication protocols, including OAuth and multi-factor
              authentication (MFA) for additional security.
            </li>
            <li>
              <b>No Data Selling:</b> We do not sell or share your personal
              information with third parties.
            </li>
            <li>
              <b>Regular Security Audits:</b> Our platform undergoes frequent
              security reviews to identify and address vulnerabilities.
            </li>
          </ul>
          Your data is safe with us, and you can review our full privacy policy
          on our website.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header>How can I contact OldPal support?</Accordion.Header>
        <Accordion.Body>
          We offer multiple ways to get in touch with our support team:
          <ul>
            <li>
              <b>Email:</b> Reach us at{" "}
              <a href="mailto:support@oldpal.com">support@oldpal.com</a>
            </li>
            <li>
              <b>Live Chat:</b> Available on our website from 9 AM to 6 PM (GMT)
            </li>
            <li>
              <b>Help Center:</b> Visit our <a href="/help">Help Center</a> for
              FAQs and troubleshooting guides
            </li>
            <li>
              <b>Social Media:</b> Connect with us on Twitter, Facebook, and
              LinkedIn for updates and support
            </li>
          </ul>
          Our team is always ready to assist you!
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header>Can I reset my password?</Accordion.Header>
        <Accordion.Body>
          Yes, if you forget your password, you can easily reset it:
          <ol>
            <li>
              Go to the login page and click on <b>"Forgot Password"</b>.
            </li>
            <li>Enter your registered email address.</li>
            <li>
              You will receive a password reset link via email. Click on it.
            </li>
            <li>Set a new password and confirm it.</li>
          </ol>
          If you don’t receive the email, check your spam folder or contact
          support.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
