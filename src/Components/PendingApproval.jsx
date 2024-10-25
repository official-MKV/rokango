import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
const PendingApprovalMessage = () => (
  <div className="flex min-h-screen bg-gray-50 items-center justify-center ">
    <div className="flex-1 p-4 lg:ml-64">
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <AlertCircle className="w-12 h-12 text-gray-400" />
            <div>
              <CardTitle className="text-xl">
                Account Pending Approval
              </CardTitle>
              <CardDescription className="mt-2">
                Thank you for signing up! Your account is currently pending
                approval. Our admin team will review your application soon.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            During this time, your account access is limited. We'll notify you
            once your account has been approved.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium mb-2">Need assistance?</p>
            <p className="text-gray-600">
              Contact our support team:
              <br />
              Phone: 09056595381
              <br />
              Email: support@example.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default PendingApprovalMessage;
