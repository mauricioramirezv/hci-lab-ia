import { Link } from 'react-router-dom';
import './account-gate.css';

export function AccountGate({ message, accountLabel, publicLabel }: { message: string; accountLabel: string; publicLabel: string }) {
  return <section className="account-gate">
    <p role="status">{message}</p>
    <div className="account-gate-actions">
      <Link className="secondary" to="/cuenta">{accountLabel}</Link>
      <Link className="secondary" to="/lab">{publicLabel}</Link>
    </div>
  </section>;
}
