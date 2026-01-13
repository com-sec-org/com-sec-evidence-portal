export interface Control {
    id: string;          // internal numeric id
    controlId: string;   // DCF-#
    name: string;
    description: string;
    category: string;
    soc2Criteria?: string;
    exampleEvidence?: string;
  }
  
  export const allControls: Control[] = [
    {
      id: "1",
      controlId: "DCF-4",
      name: "Version Control System",
      description:
        "A version control system is used to manage source code, documentation, change tracking, and release labeling. Access is restricted to authorized personnel.",
      category: "Change Management",
      soc2Criteria: "CC8.1",
      exampleEvidence:
        "Screenshots of repository settings showing branch protection rules."
    },
    {
       id: "2",
      controlId: "DCF-5",
      name: "Change Review Process",
      description:
        "Changes are peer-reviewed and approved prior to deployment by an individual different from the developer.",
      category: "Change Management",
      soc2Criteria: "CC8.1",
      exampleEvidence:
        "Pull request approvals showing peer review enforcement."
    },
    {
      id: "3",
      controlId: "DCF-6",
      name: "Production Changes Restricted",
      description:
        "Access to make changes in production environments is restricted to authorized personnel.",
      category: "Change Management",
      soc2Criteria: "CC5.1, CC8.1",
      exampleEvidence:
        "List of users with production deployment permissions."
    },
    {
      id: "4",
      controlId: "DCF-7",
      name: "Separate Environments",
      description:
        "Pre-production environments are separated from production environments and enforced with access controls.",
      category: "Change Management",
      soc2Criteria: "CC8.1",
      exampleEvidence:
        "Screenshots showing separate dev, staging, and production environments."
    },
    {
      id: "5",
      controlId: "DCF-8",
      name: "External Communication Channels",
      description:
        "External communication mechanisms exist for customers and third parties to report issues or incidents.",
      category: "Communication",
      soc2Criteria: "CC2.3",
      exampleEvidence:
        "Customer support portal or ticketing system screenshots."
    },
    {
      id: "6",
      controlId: "DCF-9",
      name: "Internal Communication Channels",
      description:
        "Internal communication channels are available for employees to report incidents or policy violations.",
      category: "Communication",
      soc2Criteria: "CC1.1, CC1.5, CC2.2",
      exampleEvidence:
        "Slack or Teams channel for security incident reporting."
    },
    {
      id: "7",
      controlId: "DCF-10",
      name: "Access Control Policy",
      description:
        "A documented access control policy outlines requirements for granting, reviewing, and revoking access.",
      category: "Policies",
      soc2Criteria: "CC6.2, CC6.3",
      exampleEvidence:
        "Access Control Policy document."
    },
    {
      id: "8",
      controlId: "DCF-11",
      name: "Periodic Access Reviews",
      description:
        "Management performs periodic reviews of user access to validate permissions remain appropriate.",
      category: "Access Control",
      soc2Criteria: "CC4.1, CC6.2, CC6.3, CC6.4",
      exampleEvidence:
        "Completed access review with management approval."
    },
    {
      id: "9",
      controlId: "DCF-12",
      name: "Baseline Configuration and Hardening Standards",
      description:
        "Baseline security configuration standards are documented for system components.",
      category: "Infrastructure",
      soc2Criteria: "CC6.1, CC7.1",
      exampleEvidence:
        "CIS benchmark or system hardening documentation."
    },
    {
      id: "10",
      controlId: "DCF-13",
      name: "Information Security Policies",
      description:
        "Information security and topic-specific policies are documented and maintained.",
      category: "Policies",
      soc2Criteria: "CC2.1, CC5.3",
      exampleEvidence:
        "Information Security Policy document."
    },
    {
      id: "11",
      controlId: "DCF-14",
      name: "Organizational Chart",
      description:
        "An organizational chart documents reporting structure and is updated upon changes.",
      category: "Governance",
      soc2Criteria: "CC1.3, CC1.5, CC2.2",
      exampleEvidence:
        "Organizational chart export or diagram."
    },
    {
      id: "12",
      controlId: "DCF-15",
      name: "Risk Assessment Policy",
      description:
        "A documented risk assessment and management policy defines risk identification and treatment.",
      category: "Risk Management",
      soc2Criteria: "CC3.1, CC3.2, CC3.3, CC3.4",
      exampleEvidence:
        "Risk assessment policy document."
    },
    {
      id: "13",
      controlId: "DCF-16",
      name: "Periodic Risk Assessment",
      description:
        "Risk assessments are conducted periodically and documented.",
      category: "Risk Management",
      soc2Criteria: "CC3.1, CC3.2, CC3.3, CC3.4",
      exampleEvidence:
        "Completed risk register or assessment report."
    },
    {
      id: "14",
      controlId: "DCF-17",
      name: "Risk Treatment Plan",
      description:
        "A documented risk treatment plan manages identified risks.",
      category: "Risk Management",
      soc2Criteria: "CC3.1, CC3.2, CC3.3, CC3.4",
      exampleEvidence:
        "Risk treatment plan document."
    },
    {
      id: "15",
      controlId: "DCF-18",
      name: "Vulnerability Scans",
      description:
        "Vulnerability scans are conducted and findings are tracked to resolution.",
      category: "Security Testing",
      soc2Criteria: "CC7.1",
      exampleEvidence:
        "Vulnerability scan report with remediation tracking."
    },
    {
      id: "16",
      controlId: "DCF-19",
      name: "Penetration Tests",
      description:
        "External penetration tests are performed periodically.",
      category: "Security Testing",
      soc2Criteria: "CC7.1",
      exampleEvidence:
        "Penetration test report and remediation evidence."
    },
    {
      id: "17",
      controlId: "DCF-20",
      name: "Asset Inventory",
      description:
        "A centralized asset inventory is maintained for systems and devices.",
      category: "Asset Management",
      soc2Criteria: "CC2.1, CC6.1",
      exampleEvidence:
        "Asset inventory spreadsheet or CMDB export."
    },
    {
      id: "18",
      controlId: "DCF-21",
      name: "Architectural Diagram",
      description:
        "An architectural diagram documents system boundaries and components.",
      category: "Documentation",
      soc2Criteria: "CC2.1",
      exampleEvidence:
        "System architecture diagram."
    },
    {
      id: "19",
      controlId: "DCF-22",
      name: "Network Diagram",
      description:
        "A network diagram documents network boundaries and connections.",
      category: "Documentation",
      soc2Criteria: "CC2.1",
      exampleEvidence:
        "Network architecture diagram."
    },
    {
      id: "20",
      controlId: "DCF-25",
      name: "Disaster Recovery Plan",
      description:
        "A disaster recovery plan outlines recovery procedures and responsibilities.",
      category: "Business Continuity",
      soc2Criteria: "CC9.1",
      exampleEvidence:
        "Disaster recovery plan document."
    },
    {
      id: "21",
      controlId: "DCF-26",
      name: "BCP/DR Tests",
      description:
        "Business continuity and disaster recovery plans are tested annually.",
      category: "Business Continuity",
      soc2Criteria: "CC9.1",
      exampleEvidence:
        "BCP/DR test report and lessons learned."
    },
    {
      id: "22",
      controlId: "DCF-27",
      name: "Cloud Resources Availability",
      description:
        "Critical cloud resources are deployed using high availability principles.",
      category: "Infrastructure",
      soc2Criteria: "CC9.1",
      exampleEvidence:
        "Cloud architecture showing multi-AZ deployment."
    },
    {
      id: "23",
      controlId: "DCF-28",
      name: "Security Events Tracked",
      description:
        "Security events are evaluated and escalated according to policy.",
      category: "Incident Management",
      soc2Criteria: "CC7.3, CC7.4",
      exampleEvidence:
        "Incident ticket with investigation notes."
    },
    {
      id: "24",
      controlId: "DCF-29",
      name: "Incident Response Team",
      description:
        "Roles and responsibilities for incident response are documented.",
      category: "Incident Management",
      soc2Criteria: "CC7.3, CC7.4",
      exampleEvidence:
        "Incident response roles document."
    },
    {
      id: "25",
      controlId: "DCF-30",
      name: "Incident Lessons Learned",
      description:
        "Post-incident reviews are documented with lessons learned.",
      category: "Incident Management",
      soc2Criteria: "CC7.5",
      exampleEvidence:
        "Post-incident review document."
    },
    {
      id: "26",
      controlId: "DCF-31",
      name: "Software Development Policies",
      description:
        "Policies govern system development lifecycle activities.",
      category: "Software Development",
      soc2Criteria: "CC8.1",
      exampleEvidence:
        "SDLC policy document."
    },
    {
      id: "27",
      controlId: "DCF-32",
      name: "Security Policies",
      description:
        "Security policies are accessible and acknowledged by personnel.",
      category: "Policies",
      soc2Criteria: "CC1.1, CC2.1",
      exampleEvidence:
        "Policy acknowledgment records."
    },
    {
      id: "28",
      controlId: "DCF-33",
      name: "Periodic Policy Reviews",
      description:
        "Policies are reviewed and approved annually.",
      category: "Policies",
      soc2Criteria: "CC2.2, CC5.3",
      exampleEvidence:
        "Policy review approval records."
    },
    {
      id: "29",
      controlId: "DCF-36",
      name: "Security Training",
      description:
        "Personnel complete security awareness training.",
      category: "Training",
      soc2Criteria: "CC1.4, CC2.2",
      exampleEvidence:
        "Training completion reports."
    },
    {
      id: "30",
      controlId: "DCF-37",
      name: "Acceptable Use Policy",
      description:
        "An acceptable use policy governs use of company assets.",
      category: "Policies",
      soc2Criteria: "CC5.3",
      exampleEvidence:
        "Acceptable use policy document."
    },
    {
      id: "31",
      controlId: "DCF-38",
      name: "Performance Evaluations",
      description:
        "Personnel performance evaluations are conducted periodically.",
      category: "Human Resources",
      soc2Criteria: "CC1.1",
      exampleEvidence:
        "Completed performance evaluation."
    },
    {
      id: "32",
      controlId: "DCF-39",
      name: "Background Checks",
      description:
        "Background checks are conducted prior to hire.",
      category: "Human Resources",
      soc2Criteria: "CC1.1",
      exampleEvidence:
        "Background check confirmation."
    },
    {
      id: "33",
      controlId: "DCF-41",
      name: "Independent Board",
      description:
        "The board includes members independent of management.",
      category: "Governance",
      soc2Criteria: "CC1.2",
      exampleEvidence:
        "Board charter showing independent members."
    },
    {
      id: "34",
      controlId: "DCF-42",
      name: "Defined Roles and Responsibilities",
      description:
        "Roles and responsibilities for compliance and risk are documented.",
      category: "Governance",
      soc2Criteria: "CC1.2, CC1.3",
      exampleEvidence:
        "Roles and responsibilities documentation."
    },
    {
      id: "35",
      controlId: "DCF-44",
      name: "Code of Conduct",
      description:
        "A documented code of conduct is acknowledged by personnel.",
      category: "Policies",
      soc2Criteria: "CC1.1",
      exampleEvidence:
        "Code of conduct acknowledgment records."
    },
    {
      id: "36",
      controlId: "DCF-45",
      name: "Data Protection Policy",
      description:
        "A policy defines data protection requirements.",
      category: "Data Protection",
      soc2Criteria: "CC6.7",
      exampleEvidence:
        "Data protection policy document."
    },
    {
      id: "37",
      controlId: "DCF-46",
      name: "Formal Screening Process",
      description:
        "A formal recruitment screening process is in place.",
      category: "Human Resources",
      soc2Criteria: "CC1.4",
      exampleEvidence:
        "Recruitment process documentation."
    },
    {
      id: "38",
      controlId: "DCF-47",
      name: "Job Descriptions",
      description:
        "Job descriptions document roles and responsibilities.",
      category: "Human Resources",
      soc2Criteria: "CC1.4",
      exampleEvidence:
        "Job description documents."
    },
    {
      id: "39",
      controlId: "DCF-48",
      name: "Screen Lockout",
      description:
        "Devices enforce screen lock after inactivity.",
      category: "Device Security",
      soc2Criteria: "CC6.6",
      exampleEvidence:
        "Device configuration showing screen lock settings."
    },
    {
      id: "40",
      controlId: "DCF-49",
      name: "Password Manager",
      description:
        "A password manager is deployed on managed devices.",
      category: "Device Security",
      soc2Criteria: "CC6.1",
      exampleEvidence:
        "Password manager deployment evidence."
    },
    {
      id: "41",
      controlId: "DCF-50",
      name: "Antimalware Software",
      description:
        "Antimalware software is installed on managed devices.",
      category: "Device Security",
      soc2Criteria: "CC7.1",
      exampleEvidence:
        "Antimalware configuration screenshots."
    },
    {
      id: "42",
      controlId: "DCF-51",
      name: "Automated OS Updates",
      description:
        "Operating system updates are automated.",
      category: "Device Security",
      soc2Criteria: "CC7.1",
      exampleEvidence:
        "OS update configuration settings."
    },
    {
      id: "43",
      controlId: "DCF-52",
      name: "Hard Disk Encryption",
      description:
        "Disk encryption is enabled on managed devices.",
      category: "Device Security",
      soc2Criteria: "CC6.1",
      exampleEvidence:
        "Disk encryption settings."
    },
    {
      id: "44",
      controlId: "DCF-54",
      name: "Encryption at Rest",
      description:
        "Data at rest is encrypted using strong cryptography.",
      category: "Encryption",
      soc2Criteria: "CC6.1",
      exampleEvidence:
        "Database encryption configuration."
    },
    {
      id: "45",
      controlId: "DCF-55",
      name: "Encryption in Transit",
      description:
        "Data in transit is encrypted using TLS or equivalent.",
      category: "Encryption",
      soc2Criteria: "CC6.1",
      exampleEvidence:
        "TLS configuration screenshots."
    },
    {
      id: "46",
      controlId: "DCF-56",
      name: "Vendor Register",
      description:
        "A centralized vendor register is maintained.",
      category: "Vendor Management",
      soc2Criteria: "CC9.2",
      exampleEvidence:
        "Vendor inventory spreadsheet."
    },
    {
      id: "47",
      controlId: "DCF-57",
      name: "Vendor Compliance Monitoring",
      description:
        "Vendor compliance evidence is reviewed annually.",
      category: "Vendor Management",
      soc2Criteria: "CC9.2",
      exampleEvidence:
        "SOC reports or vendor assessments."
    },
    {
      id: "48",
      controlId: "DCF-59",
      name: "Privileged Access Restricted",
      description:
        "Administrative access is restricted to authorized users.",
      category: "Access Control",
      soc2Criteria: "CC6.1",
      exampleEvidence:
        "Admin user access list."
    },
    {
      id: "49",
      controlId: "DCF-60",
      name: "Secure Password Storage",
      description:
        "Passwords and secrets are stored securely.",
      category: "Access Control",
      soc2Criteria: "CC6.1",
      exampleEvidence:
        "Secrets management configuration."
    },
    {
      id: "50",
      controlId: "DCF-61",
      name: "Customer Data Segregation",
      description:
        "Customer data is logically segregated.",
      category: "Data Segregation",
      soc2Criteria: "CC6.1",
      exampleEvidence:
        "Database schema showing tenant separation."
    },
    {
        id: "51",
        controlId: "DCF-62",
        name: "Session Termination",
        description:
          "User sessions are automatically terminated after predefined inactivity periods.",
        category: "Access Control",
        soc2Criteria: "CC6.6",
        exampleEvidence:
          "Application or IdP session timeout configuration screenshots."
      },
      {
        id: "52",
        controlId: "DCF-63",
        name: "Terms of Service",
        description:
          "Users are required to agree to terms of service prior to system use.",
        category: "Agreements",
        soc2Criteria: "CC2.3",
        exampleEvidence:
          "Screenshot of user sign-up flow requiring ToS acceptance."
      },
      {
        id: "53",
        controlId: "DCF-64",
        name: "Commitments Communicated to Customers",
        description:
          "Service commitments and system requirements are communicated to customers.",
        category: "Communication",
        soc2Criteria: "CC2.3, CC3.1",
        exampleEvidence:
          "Customer contract or website page showing service commitments."
      },
      {
        id: "54",
        controlId: "DCF-65",
        name: "Public Privacy Policy",
        description:
          "A publicly available privacy policy is maintained.",
        category: "Privacy",
        soc2Criteria: "P1.1",
        exampleEvidence:
          "Link to publicly available privacy policy."
      },
      {
        id: "55",
        controlId: "DCF-66",
        name: "Master Service Agreements",
        description:
          "Master service agreements define customer requirements where applicable.",
        category: "Agreements",
        soc2Criteria: "CC2.3",
        exampleEvidence:
          "Executed master service agreement."
      },
      {
        id: "56",
        controlId: "DCF-67",
        name: "Multi-Factor Authentication",
        description:
          "Multi-factor authentication is required for system access.",
        category: "Authentication",
        soc2Criteria: "CC6.1, CC6.6",
        exampleEvidence:
          "Screenshots of MFA enforcement in identity provider."
      },
      {
        id: "57",
        controlId: "DCF-68",
        name: "Password Policy",
        description:
          "Password requirements are defined and enforced.",
        category: "Authentication",
        soc2Criteria: "CC6.1",
        exampleEvidence:
          "Password policy configuration screenshots."
      },
      {
        id: "58",
        controlId: "DCF-69",
        name: "Access Provisioning",
        description:
          "Access requests are approved based on least privilege principles.",
        category: "Access Control",
        soc2Criteria: "CC5.1, CC6.2",
        exampleEvidence:
          "Access request ticket with approval."
      },
      {
        id: "59",
        controlId: "DCF-70",
        name: "Access Deprovisioning",
        description:
          "User access is revoked promptly upon termination.",
        category: "Access Control",
        soc2Criteria: "CC6.2",
        exampleEvidence:
          "Offboarding checklist showing access revocation."
      },
      {
        id: "60",
        controlId: "DCF-71",
        name: "Unique User IDs",
        description:
          "Unique user IDs are enforced for authentication.",
        category: "Authentication",
        soc2Criteria: "CC6.1",
        exampleEvidence:
          "User directory export showing unique identifiers."
      },
      {
        id: "61",
        controlId: "DCF-72",
        name: "Root Access Control",
        description:
          "Root access to production resources is restricted and monitored.",
        category: "Access Control",
        soc2Criteria: "CC6.1",
        exampleEvidence:
          "Cloud IAM configuration showing root access disabled."
      },
      {
        id: "62",
        controlId: "DCF-73",
        name: "Restricted Remote Administration Ports",
        description:
          "Remote administrative ports are restricted to authorized IP ranges.",
        category: "Network Security",
        soc2Criteria: "CC6.6",
        exampleEvidence:
          "Firewall or security group rules."
      },
      {
        id: "63",
        controlId: "DCF-74",
        name: "Communication of System Changes",
        description:
          "System changes are communicated to customers.",
        category: "Communication",
        soc2Criteria: "CC2.3",
        exampleEvidence:
          "Release notes or change log."
      },
      {
        id: "64",
        controlId: "DCF-75",
        name: "Restricted Public Access",
        description:
          "Cloud resources are configured to deny public access.",
        category: "Network Security",
        soc2Criteria: "CC6.1",
        exampleEvidence:
          "Cloud storage public access settings."
      },
      {
        id: "65",
        controlId: "DCF-76",
        name: "Critical Change Management",
        description:
          "Emergency changes are reviewed and approved post-implementation.",
        category: "Change Management",
        soc2Criteria: "CC8.1",
        exampleEvidence:
          "Post-implementation review documentation."
      },
      {
        id: "66",
        controlId: "DCF-77",
        name: "Data Backups",
        description:
          "Production data backups are performed regularly.",
        category: "Data Protection",
        soc2Criteria: "A1.2",
        exampleEvidence:
          "Backup configuration screenshots."
      },
      {
        id: "67",
        controlId: "DCF-78",
        name: "Storage Bucket Versioning",
        description:
          "Versioning is enabled on storage buckets containing sensitive data.",
        category: "Data Protection",
        soc2Criteria: "CC7.1",
        exampleEvidence:
          "Storage bucket versioning configuration."
      },
      {
        id: "68",
        controlId: "DCF-79",
        name: "Centralized Logging",
        description:
          "System activity logs are collected and retained centrally.",
        category: "Monitoring",
        soc2Criteria: "CC7.2",
        exampleEvidence:
          "Log management dashboard screenshots."
      },
      {
        id: "69",
        controlId: "DCF-85",
        name: "Network Security Controls",
        description:
          "Network security controls restrict inbound and outbound traffic.",
        category: "Network Security",
        soc2Criteria: "CC6.6",
        exampleEvidence:
          "Firewall rules or security groups."
      },
      {
        id: "70",
        controlId: "DCF-86",
        name: "System Monitoring",
        description:
          "Production systems are continuously monitored.",
        category: "Monitoring",
        soc2Criteria: "CC7.1",
        exampleEvidence:
          "Monitoring dashboards and alerts."
      },
      {
        id: "71",
        controlId: "DCF-87",
        name: "Threat Detection",
        description:
          "Threat detection mechanisms identify anomalous activity.",
        category: "Security Monitoring",
        soc2Criteria: "CC7.1",
        exampleEvidence:
          "Threat detection alerts or tool configuration."
      },
      {
        id: "72",
        controlId: "DCF-88",
        name: "Web Application Firewall",
        description:
          "A web application firewall protects public-facing applications.",
        category: "Network Security",
        soc2Criteria: "CC7.2",
        exampleEvidence:
          "WAF ruleset configuration."
      },
      {
        id: "73",
        controlId: "DCF-90",
        name: "Root Infrastructure Monitoring",
        description:
          "Root account access is monitored and reviewed.",
        category: "Access Control",
        soc2Criteria: "CC7.2",
        exampleEvidence:
          "Cloud audit logs showing root activity."
      },
      {
        id: "74",
        controlId: "DCF-91",
        name: "Intrusion Detection",
        description:
          "Intrusion detection or prevention systems are deployed.",
        category: "Network Security",
        soc2Criteria: "CC7.2",
        exampleEvidence:
          "IDS/IPS configuration screenshots."
      },
      {
        id: "75",
        controlId: "DCF-92",
        name: "Encrypted Remote Access",
        description:
          "Remote access to production systems uses encrypted connections.",
        category: "Network Security",
        soc2Criteria: "CC6.6",
        exampleEvidence:
          "VPN or SSH encryption settings."
      },
      {
        id: "76",
        controlId: "DCF-94",
        name: "Physical Security Policy",
        description:
          "Physical security requirements are documented.",
        category: "Physical Security",
        soc2Criteria: "CC6.4",
        exampleEvidence:
          "Physical security policy document."
      },
      {
        id: "77",
        controlId: "DCF-95",
        name: "Processing Capacity Monitoring",
        description:
          "System processing capacity is monitored.",
        category: "Monitoring",
        soc2Criteria: "A1.1",
        exampleEvidence:
          "Capacity monitoring dashboards."
      },
      {
        id: "78",
        controlId: "DCF-96",
        name: "Load Balancing",
        description:
          "Load balancing distributes traffic across resources.",
        category: "Infrastructure",
        soc2Criteria: "A1.1",
        exampleEvidence:
          "Load balancer configuration."
      },
      {
        id: "79",
        controlId: "DCF-97",
        name: "Autoscaling",
        description:
          "Autoscaling provisions resources based on demand.",
        category: "Infrastructure",
        soc2Criteria: "A1.1",
        exampleEvidence:
          "Autoscaling policy configuration."
      },
      {
        id: "80",
        controlId: "DCF-99",
        name: "Backup Monitoring",
        description:
          "Backup failures trigger automated alerts.",
        category: "Data Protection",
        soc2Criteria: "A1.2",
        exampleEvidence:
          "Backup alert notifications."
      },
      {
        id: "81",
        controlId: "DCF-100",
        name: "Backup Restore Testing",
        description:
          "Backup restoration tests validate recoverability.",
        category: "Data Protection",
        soc2Criteria: "A1.3",
        exampleEvidence:
          "Backup restore test results."
      },
      {
        id: "82",
        controlId: "DCF-101",
        name: "Data Retention Policy",
        description:
          "Data retention requirements are documented.",
        category: "Data Management",
        soc2Criteria: "C1.1",
        exampleEvidence:
          "Data retention policy document."
      },
      {
        id: "83",
        controlId: "DCF-102",
        name: "Data Classification Policy",
        description:
          "Data classification requirements are defined.",
        category: "Data Management",
        soc2Criteria: "C1.1",
        exampleEvidence:
          "Data classification policy."
      },
      {
        id: "84",
        controlId: "DCF-103",
        name: "Customer Data Deletion",
        description:
          "Customer data is deleted upon termination of services.",
        category: "Data Management",
        soc2Criteria: "C1.2",
        exampleEvidence:
          "Data deletion logs."
      },
      {
        id: "85",
        controlId: "DCF-104",
        name: "Test Data Controls",
        description:
          "Production data is not used in test environments.",
        category: "Data Management",
        soc2Criteria: "C1.1",
        exampleEvidence:
          "Screenshots of masked or mock data."
      },
      {
        id: "86",
        controlId: "DCF-105",
        name: "Personnel NDAs",
        description:
          "Personnel sign confidentiality agreements prior to hire.",
        category: "Agreements",
        soc2Criteria: "CC1.1",
        exampleEvidence:
          "Executed NDA."
      },
      {
        id: "87",
        controlId: "DCF-107",
        name: "Secure Paper Disposal",
        description:
          "Sensitive paper records are securely disposed.",
        category: "Data Management",
        soc2Criteria: "CC6.5",
        exampleEvidence:
          "Shredding service documentation."
      },
      {
        id: "88",
        controlId: "DCF-108",
        name: "Secure Storage",
        description:
          "Secure storage mechanisms protect sensitive assets.",
        category: "Physical Security",
        soc2Criteria: "CC6.4",
        exampleEvidence:
          "Secure storage photographs."
      },
      {
        id: "89",
        controlId: "DCF-109",
        name: "Hardware Data Disposal",
        description:
          "Hardware is wiped or destroyed securely.",
        category: "Data Management",
        soc2Criteria: "CC6.5",
        exampleEvidence:
          "Certificate of destruction."
      },
      {
        id: "90",
        controlId: "DCF-110",
        name: "Input Validation",
        description:
          "Automated checks validate input ranges and formats.",
        category: "Application Controls",
        soc2Criteria: "PI1.2",
        exampleEvidence:
          "Application validation screenshots."
      },
      {
        id: "91",
        controlId: "DCF-111",
        name: "Mandatory Fields",
        description:
          "Mandatory data fields are enforced.",
        category: "Application Controls",
        soc2Criteria: "PI1.2",
        exampleEvidence:
          "Form validation screenshots."
      },
      {
        id: "92",
        controlId: "DCF-112",
        name: "Privacy Notice Acknowledgement",
        description:
          "Users acknowledge privacy practices.",
        category: "Privacy",
        soc2Criteria: "P1.1",
        exampleEvidence:
          "Account signup privacy acknowledgement."
      },
      {
        id: "93",
        controlId: "DCF-115",
        name: "Privacy Policy Content",
        description:
          "Privacy policy includes required disclosures.",
        category: "Privacy",
        soc2Criteria: "P3.2",
        exampleEvidence:
          "Privacy policy document."
      },
      {
        id: "94",
        controlId: "DCF-120",
        name: "Privacy Policy Review",
        description:
          "Privacy policy is reviewed annually.",
        category: "Privacy",
        soc2Criteria: "P1.1",
        exampleEvidence:
          "Policy review records."
      },
      {
        id: "95",
        controlId: "DCF-122",
        name: "PII Deletion Requests",
        description:
          "Requests to delete personal data are fulfilled.",
        category: "Privacy",
        soc2Criteria: "P4.3",
        exampleEvidence:
          "PII deletion request ticket."
      },
      {
        id: "96",
        controlId: "DCF-123",
        name: "Information Disposal Procedures",
        description:
          "Procedures govern disposal of information.",
        category: "Privacy",
        soc2Criteria: "CC6.5",
        exampleEvidence:
          "Information disposal procedures document."
      },
      {
        id: "97",
        controlId: "DCF-126",
        name: "User Personal Data Access",
        description:
          "Users can access and correct personal data.",
        category: "Privacy",
        soc2Criteria: "P5.1",
        exampleEvidence:
          "User profile screenshots."
      },
      {
        id: "98",
        controlId: "DCF-127",
        name: "Privacy Requirements for Vendors",
        description:
          "Privacy requirements are communicated to vendors.",
        category: "Privacy",
        soc2Criteria: "P6.1",
        exampleEvidence:
          "Vendor agreement privacy clauses."
      },
      {
        id: "99",
        controlId: "DCF-130",
        name: "PII Breach Documentation",
        description:
          "Personal data breaches are documented.",
        category: "Privacy",
        soc2Criteria: "P6.3",
        exampleEvidence:
          "Breach incident documentation."
      },
      {
        id: "100",
        controlId: "DCF-132",
        name: "Third-Party Privacy Agreements",
        description:
          "Agreements define privacy and security requirements.",
        category: "Privacy",
        soc2Criteria: "P6.5",
        exampleEvidence:
          "Third-party data processing agreement."
      },
      {
        id: "101",
        controlId: "DCF-135",
        name: "Incident Notification",
        description:
          "Affected parties are notified of incidents.",
        category: "Privacy",
        soc2Criteria: "CC7.3",
        exampleEvidence:
          "Incident notification email."
      },
      {
        id: "102",
        controlId: "DCF-136",
        name: "Subprocessor Disclosure",
        description:
          "Use of subprocessors is communicated to customers.",
        category: "Privacy",
        soc2Criteria: "P6.1",
        exampleEvidence:
          "Subprocessor list webpage."
      },
      {
        id: "103",
        controlId: "DCF-140",
        name: "Privacy Contact Mechanism",
        description:
          "A contact mechanism exists for privacy inquiries.",
        category: "Privacy",
        soc2Criteria: "P4.3",
        exampleEvidence:
          "Privacy contact email or form."
      },
      {
        id: "104",
        controlId: "DCF-141",
        name: "Privacy Request Tracking",
        description:
          "Privacy requests are tracked and logged.",
        category: "Privacy",
        soc2Criteria: "P6.7",
        exampleEvidence:
          "Privacy request tracking system."
      },
      {
        id: "105",
        controlId: "DCF-144",
        name: "Board Charter",
        description:
          "The board charter outlines oversight responsibilities.",
        category: "Governance",
        soc2Criteria: "CC1.2",
        exampleEvidence:
          "Board charter document."
      },
      {
        id: "106",
        controlId: "DCF-146",
        name: "Board Meetings",
        description:
          "Board meetings review compliance and risk.",
        category: "Governance",
        soc2Criteria: "CC1.2",
        exampleEvidence:
          "Board meeting minutes."
      }
    ];
    
  