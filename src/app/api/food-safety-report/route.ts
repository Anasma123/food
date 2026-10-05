import { NextRequest, NextResponse } from "next/server";
import { AUTHORITIES_DIRECTORY, AuthorityContact } from "@/lib/data-science/datasets";

export interface FoodComplaint {
  id: string;
  trackingNumber: string;
  timestamp: string;
  productName: string;
  brandOrEstablishment: string;
  batchNumber: string;
  expiryDate: string;
  selectedAuthorityId: string;
  selectedAuthorityName: string;
  authorityEmail: string;
  issueType: "foreign_matter" | "spoilage_mold" | "chemical_taste" | "expired_sale" | "misleading_claims" | "hygiene_failure";
  description: string;
  complainantName: string;
  complainantPhone: string;
  status: "PENDING_ADMIN_REVIEW" | "APPROVED_AND_DISPATCHED" | "REJECTED_INSUFFICIENT_EVIDENCE";
  adminReviewedBy?: string;
  adminNotes?: string;
  evidencePhotoBase64?: string;
}

// In-memory complaint storage
export const COMPLAINTS_REGISTRY: FoodComplaint[] = [
  {
    id: "comp_demo_101",
    trackingNumber: "FSSAI-KL-2026-8472",
    timestamp: "2026-10-05 10:15 AM",
    productName: "Packaged Mixed Fruit Beverage (1L)",
    brandOrEstablishment: "Packaged Beverage Bottlers",
    batchNumber: "LOT-8472-EXP26",
    expiryDate: "2026-12-31",
    selectedAuthorityId: "auth_kerala_cfs",
    selectedAuthorityName: "Commissionerate of Food Safety, Kerala",
    authorityEmail: "foodsafetykerala@gmail.com",
    issueType: "chemical_taste",
    description: "Strong uncharacteristic chemical odor and suspended sediment observed upon unsealing safety cap.",
    complainantName: "Registered Consumer",
    complainantPhone: "+91 98000 00000",
    status: "PENDING_ADMIN_REVIEW",
    adminReviewedBy: undefined,
    adminNotes: undefined
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    complaints: COMPLAINTS_REGISTRY,
    authorities: AUTHORITIES_DIRECTORY
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // Admin action: Approve & Mark Send Done (Demo Simulation - No actual outbound SMTP)
    if (action === "admin_approve_and_dispatch_email" || action === "admin_update_status") {
      const { complaintId, newStatus = "APPROVED_AND_DISPATCHED", adminNotes } = body;
      const comp = COMPLAINTS_REGISTRY.find(c => c.id === complaintId);
      if (!comp) {
        return NextResponse.json({ success: false, error: "Complaint not found" }, { status: 404 });
      }

      // Pure demo simulation: No real network email sent
      const emailDispatchRecord = {
        dispatchId: `DEMO_DISP_${Date.now()}`,
        toAuthority: comp.selectedAuthorityName,
        recipientEmail: comp.authorityEmail || "foodsafety-kerala@gov.in",
        ccEmails: ["district-food-inspector@nic.in", "legal-enforcement@fssai.gov.in"],
        sentTimestamp: new Date().toLocaleString(),
        trackingReference: comp.trackingNumber,
        subject: `[OFFICIAL NOTICE] Food Safety Violation Dossier - Ref #${comp.trackingNumber}`,
        dispatchedBy: "Silu (Chief Food Safety Officer & System Admin)",
        transmissionStatus: "DEMO_SIMULATION_SEND_DONE",
        demoNotice: "Real mail dispatch is suppressed. Status marked as Send Done for demo presentation."
      };

      comp.status = newStatus as any;
      comp.adminReviewedBy = "Silu (System Admin & Safety Auditor)";
      comp.adminNotes = adminNotes || `Verified by Safety Admin. Status marked: Send Done (Demo simulation mode).`;
      (comp as any).emailDispatch = emailDispatchRecord;

      return NextResponse.json({
        success: true,
        message: `✓ Complaint #${comp.trackingNumber} Approved! Status: Send Done (Demo Mode - Real mail dispatch suppressed)`,
        complaint: comp,
        emailDispatch: emailDispatchRecord
      });
    }

    // User action: Submit new complaint
    const {
      productName,
      brandOrEstablishment,
      batchNumber,
      expiryDate,
      selectedAuthorityId,
      issueType,
      description,
      complainantName,
      complainantPhone,
      evidencePhotoBase64
    } = body;

    if (!productName || !description || !complainantName) {
      return NextResponse.json({ success: false, error: "Missing required complaint details" }, { status: 400 });
    }

    const auth = AUTHORITIES_DIRECTORY.find(a => a.id === selectedAuthorityId) || AUTHORITIES_DIRECTORY[0];
    const trackingNum = `FSSAI-GRIEV-${Math.floor(100000 + Math.random() * 900000)}`;

    const newComplaint: FoodComplaint = {
      id: `comp_${Date.now()}`,
      trackingNumber: trackingNum,
      timestamp: new Date().toLocaleString(),
      productName,
      brandOrEstablishment: brandOrEstablishment || "Not specified",
      batchNumber: batchNumber || "N/A",
      expiryDate: expiryDate || "N/A",
      selectedAuthorityId: auth.id,
      selectedAuthorityName: auth.name,
      authorityEmail: auth.complaintEmail,
      issueType: issueType || "spoilage_mold",
      description,
      complainantName,
      complainantPhone: complainantPhone || "Confidential",
      status: "PENDING_ADMIN_REVIEW",
      evidencePhotoBase64
    };

    COMPLAINTS_REGISTRY.unshift(newComplaint);

    return NextResponse.json({
      success: true,
      message: "Complaint registered successfully and submitted for Admin verification!",
      complaint: newComplaint
    });
  } catch (err: any) {
    console.error("Food safety report error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
