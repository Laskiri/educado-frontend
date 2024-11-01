export interface NewApplication {
    baseUser: string | undefined;
    motivation: string;
  
    educationLevel: string[];
    status: string[];
    course: string[];
    institution: string[];
    educationStartDate: string[];
    educationEndDate: string[];

    company: string[];
    jobTitle: string[];
    workStartDate: string[];
    workEndDate: string[];
    description: string[];
}