import mongoose, { Document } from "mongoose"

export interface LoginService {
    identifier: string,
    password: string
}

export interface SendOTPService {
    identifier: string,
    purpose: string,
    identifierType?: string,
    email?: string,
    phone?: string,
    username?: string,
    userId?: string
}

export interface RegisterService {
    email: string,
    phone: string,
    username: string,
    role: string,
    password: string
}

export interface VerifyOTPService {
    identifier: string,
    otp: string,
    purpose: string,
    username?: string,
    role?: string,
    email?: string,
    phone?: string,
    userId?: string
}

export interface PasscodeService {
    identifier: string,
    passcode: string
}

export interface ChangePasswordService {
    userId: string;
    currentPassword: string;
    newPassword: string;
}

export interface UpdateProfileService {
    userId: string;
    username?: string;
    email?: string;
    phone?: string;
    password?: string; // required if email or phone is changed
}



export interface IUser extends Document {
    userId: string;
    vertevId?: string;
    profileImg?: string;
    currentEarning?: string;
    city?: string;
    pinCode?: string;
    houseNo?: string;
    street?: string;
    landmark?: string;
    dateOfBirth?: Date;
    fatherName?: string;
    age?: number;
    nominee: {
        name?: string;
        relation?: string;
        phoneNumber?: string;
        isVerified?: boolean;
    };
    guarantor: {
        name?: string;
        relation?: string;
        phoneNumber?: string;
        isVerified?: boolean;
    }[];
    aadhar: {
        aadharNumber?: string;
        pdfUrl?: string;
        adharbackUrl?: string;
        status?: string;
        verifiedAt?: Date | null;
        rejectedAt?: Date | null;
        dob?: string;
        gender?: string;
        eaadhaar?: string;
        mobile?: string;
        document_consent_validity?: Date;
        verification_id?: string;
        reference_id?: string;
        name?: string;
        uid?: string;
        care_of?: string;
        address?: string;
        photo_link?: string;
        metaData?: Array<{
            actionBy?: string;
            actionAt?: Date;
            description?: string;
        }>;
    };
    pan: {
        panNumber?: string;
        pdfUrl?: string;
        status?: string;
        verifiedAt?: Date | null;
        rejectedAt?: Date | null;
        metaData?: Array<{
            actionBy?: string;
            actionAt?: Date;
            description?: string;
        }>;
    };
    drivingLicense: {
        dlNumber?: string;
        pdfUrl?: string;
        status?: string;
        verifiedAt?: Date | null;
        rejectedAt?: Date | null;
        metaData?: Array<{
            actionBy?: string;
            actionAt?: Date;
            description?: string;
        }>;
    };
    bankDetails: {
        accountNumber?: string;
        bankName?: string;
        branch?: string;
        ifsc?: string;
        accountHolderName?: string;
        passbookPdf?: string;
        status?: string;
        verifiedAt?: Date | null;
        rejectedAt?: Date | null;
        metaData?: Array<{
            actionBy?: string;
            actionAt?: Date;
            description?: string;
        }>;
    };
    personalInfoMetaData: Array<{
        actionBy?: string;
        actionAt?: Date;
        description?: string;
    }>;
    verificationStatus: {
        personalInfoStatus?: string;
        aadharVerificationStatus?: string;
        panVerificationStatus?: string;
        dlVerificationStatus?: string;
        bankVerificationStatus?: string;
        overallStatus?: string;
    };
    wallet?: {
        walletId?: mongoose.Types.ObjectId;
        amount?: string; // Deprecated: keeping for backward compatibility
    };
    preferences?: {
        preferredVehicleType?: string;
        preferredPickupLocation?: {
            latitude: number;
            longitude: number;
            address: string;
        };
        notifications?: {
            email?: boolean;
            sms?: boolean;
            push?: boolean;
        };
    };
    emergencyContacts?: Array<{
        name?: string;
        phoneNumber?: string;
        relation?: string;
    }>;
    rentals?: {
        totalRentals?: number;
        activeRentals?: number;
        totalKmDriven?: number;
        favoriteVehicles?: Array<mongoose.Types.ObjectId>;

    };
    creditScore?: {
        score?: number;
        factors?: Array<{
            factor: string;
            impact: string;
            description: string;
        }>;
        lastUpdated?: Date;
    };
}