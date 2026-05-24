import type { CSSProperties } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BadgeDollarSign,
  Bot,
  Box,
  Building2,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cloud,
  Cpu,
  Database,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Flag,
  Hash,
  History,
  Inbox,
  Info,
  Landmark,
  Link2,
  Mail,
  MessageCircle,
  Package,
  Scan,
  ScanLine,
  Search,
  Shield,
  ShieldCheck,
  Ship,
  Sparkles,
  Truck,
  Upload,
  User,
  Users,
  WifiOff,
  X,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  alert: AlertTriangle,
  alert_circle: AlertCircle,
  arrow_left: ArrowLeft,
  arrow_right: ArrowRight,
  badge_dollar: BadgeDollarSign,
  bar_chart: BarChart3,
  bot: Bot,
  box: Box,
  building: Building2,
  check: Check,
  check_check: CheckCheck,
  check_circle: CheckCircle2,
  chevron_right: ChevronRight,
  clock: Clock,
  cloud: Cloud,
  cpu: Cpu,
  database: Database,
  download: Download,
  eye: Eye,
  file: FileText,
  file_check: FileCheck2,
  flag: Flag,
  hash: Hash,
  history: History,
  inbox: Inbox,
  info: Info,
  landmark: Landmark,
  link: Link2,
  mail: Mail,
  message: MessageCircle,
  package: Package,
  scan: Scan,
  scan_line: ScanLine,
  search: Search,
  shield: Shield,
  shield_check: ShieldCheck,
  ship: Ship,
  sparkle: Sparkles,
  truck: Truck,
  upload: Upload,
  user: User,
  users: Users,
  wifi_off: WifiOff,
  x: X,
  x_circle: XCircle,
  zap: Zap,
};

interface AppIconProps {
  name: string;
  size?: 12 | 14 | 16 | 20 | number;
  className?: string;
  style?: CSSProperties;
  strokeWidth?: number;
  "aria-hidden"?: boolean;
}

export function AppIcon({
  name,
  size = 14,
  className,
  style,
  strokeWidth = 1.5,
  "aria-hidden": ariaHidden = true,
}: AppIconProps) {
  const Icon = ICONS[name] ?? FileText;

  return (
    <Icon
      aria-hidden={ariaHidden}
      className={className}
      size={size}
      strokeWidth={strokeWidth}
      style={{ flexShrink: 0, ...style }}
    />
  );
}
