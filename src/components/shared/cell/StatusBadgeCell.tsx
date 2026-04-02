import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserStatus } from "@/types/user.types";

interface IStatusBadgeCellProps {
    status : UserStatus;
}
const StatusBadgeCell = ({ status }: IStatusBadgeCellProps) => {
    const statusClassName =
        status === UserStatus.ACTIVE
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
            : status === UserStatus.BLOCKED
                ? "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                : "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200";

    return (
        <Badge
            variant="outline"
            className={cn("text-xs font-medium", statusClassName)}
        >
            <span className="capitalize">{status.toLowerCase()}</span>
        </Badge>
    );
}

export default StatusBadgeCell;