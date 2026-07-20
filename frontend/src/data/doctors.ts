export interface DoctorReview {
  author: string;
  rating: number;
  text: string;
  avatar: string;
}

export interface Doctor {
  id: string;
  slug: string;
  name: string;
  photo: string;
  specialty: string;
  specialtyIcon: string;
  qualifications: string;
  yearsExperience: number;
  languages: string[];
  bio: string;
  availableDays: string[];
  availabilityTime: string;
  rating: number;
  reviewCount: number;
  reviews: DoctorReview[];
}

export const doctors: Doctor[] = [
  {
    id: "elena-rodriguez",
    slug: "elena-rodriguez",
    name: "Dr. Elena Rodriguez",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4P6WN3taShFmUUfI_8fkm2pV37NH5UDSfv4f6xu8tjp0_JlCI1VBT-Cq50xOKfN_N335N1cehC0tqlwXZQmkB1ahluLxjZ-mDXPsZovIafvKCPSdBwrq3C1k5LdunaDVj5oGFA0ESFd24x4E6GZjJBpjJW4UvAPG2cbzPotdbFvHRdotbJEx3u-P82yZntBTwnK-_WN_9Rwb1EDwzx3jHinCBEso9LN1NEq2hHaZ9GALl55NIsZdlJO0vDuLtoC-eCcZz-uZOArvP",
    specialty: "Pediatrics",
    specialtyIcon: "child_care",
    qualifications: "MD, FAAP",
    yearsExperience: 12,
    languages: ["English", "Spanish"],
    bio: "Dedicated to providing compassionate and comprehensive pediatric care. Dr. Rodriguez believes in building strong partnerships with parents to ensure the healthy development and well-being of every child, from newborns to adolescents, in a warm and welcoming environment.",
    availableDays: ["Mon", "Wed", "Fri"],
    availabilityTime: "8:00 AM - 4:00 PM",
    rating: 4.9,
    reviewCount: 124,
    reviews: [
      {
        author: "Sarah T.",
        rating: 5,
        text: "Dr. Rodriguez has been amazing with both my children. She is incredibly patient, takes the time to explain everything clearly, and really puts the kids at ease. Highly recommend her to any parent!",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGKiaP8rvOhrg017dQxwtBe-ScldrZDo4AUFMQb2xMtrdQlyRB5RqzXVE1Jb0XYbekIDhW0AekXdHhWUveqdBXrEBUH_PxMLKfdh6PMMWvmR8ngQuY9F3TJ7YLTLxFtsoWV7WUJa8kTHygVrKvserejGbyH4d0MWAGyWy-FGV50-ZjfuguxQtk13LdPGc1dtPClVhqnDzEnjNnaRt503owF_ra4APso0TIdq55shPB-V4sbuPTr3EuruKb4NorOUoqfpnGOtO8AnSd",
      },
      {
        author: "Michael R.",
        rating: 5,
        text: "We've been seeing Dr. Elena for 3 years now. Her bedside manner is exceptional. She never rushes appointments and always makes sure we leave with all our questions answered. A true professional.",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZuI5eRnpWlN0AHcLAiqS-WyIFDWRarW8Jem4JOx5zPbbwhYcYNTUywwPCavbl03SXMv463t5hiw1OH8wmpcXCKrRR5GqZMu4sMCugN-UM3xlT2UIlznZeES6-ax0euZxrK1HxMMwi-RSE8xE6dQ3IvGsS5N2wxFK4OeWVRZLIGWjsNt3cHEWUEOJ3iXk26g8yb1ZggAGBaJYYa3NrU53PMKHj42c7J8QEMK9YrIOadoKtGmK0SmmfGHWQzwYX5tUPu0nX34KBIXa7",
      },
    ],
  },
  {
    id: "marcus-vance",
    slug: "marcus-vance",
    name: "Dr. Marcus Vance",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhI3hxWzABR6hyjnCt2BiIlodha8fbekwIOv40uNs8xa7wmnZDaaqOlqCYfVhG82nJWfDQ0RDp9X0eRVF3BIpBpzgzN4G89N1ZY_Vw62xUN_xZgY7lN611mrRn33y-4BE-kQ28cjIPLyCAqRvejLuxtC6pW6URY7JgSHIF3TXinvQ0e32AGKBfx5edJBFgB1SWXHK8kHNxR7y50CcS8T_uY-RvdZMYFHxXWReAaHVBOl4tzS33RfmlgxWO7kT1TKtGzDKD_D8dlk7y",
    specialty: "Cardiology",
    specialtyIcon: "favorite",
    qualifications: "MD, FACC",
    yearsExperience: 22,
    languages: ["English"],
    bio: "Dr. Marcus Vance is a board-certified cardiologist with over two decades of clinical experience. Specializing in preventative cardiology and diagnostic imaging, he is committed to helping patients achieve optimal cardiovascular health.",
    availableDays: ["Tue", "Thu"],
    availabilityTime: "9:00 AM - 5:00 PM",
    rating: 4.8,
    reviewCount: 98,
    reviews: [
      {
        author: "John D.",
        rating: 5,
        text: "Dr. Vance is very thorough and knowledgeable. He explained my cardiac test results in simple terms and helped me feel confident about my treatment plan.",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGKiaP8rvOhrg017dQxwtBe-ScldrZDo4AUFMQb2xMtrdQlyRB5RqzXVE1Jb0XYbekIDhW0AekXdHhWUveqdBXrEBUH_PxMLKfdh6PMMWvmR8ngQuY9F3TJ7YLTLxFtsoWV7WUJa8kTHygVrKvserejGbyH4d0MWAGyWy-FGV50-ZjfuguxQtk13LdPGc1dtPClVhqnDzEnjNnaRt503owF_ra4APso0TIdq55shPB-V4sbuPTr3EuruKb4NorOUoqfpnGOtO8AnSd",
      },
    ],
  },
  {
    id: "priya-patel",
    slug: "priya-patel",
    name: "Dr. Priya Patel",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlnp4-n9WMy-JYknhier5SRRpbylRD7na-GOZElT8cfAdvX9zHSh44nWEmNFEZie1IymkYrpll7dU69cTOzYidYfVafq-b8v8eZiABir-Dz62EqjLtavShvELNvgh_Xe59QQehA2J7LAKE4d0ASBjcqoEseXKeWsERiKT__0i-bnsQN0GgJTO7dwIY9LCvxnolVJahQL7X-7bjxKr1ISNFkzYCwbtF0xwZRSRkzmtOzO5zdDU4aDP2_eG2v2u-L7VKdVGXnj3726Ok",
    specialty: "Neurology",
    specialtyIcon: "psychology",
    qualifications: "MD, PhD",
    yearsExperience: 9,
    languages: ["English", "Hindi", "Gujarati"],
    bio: "Dr. Priya Patel specializes in neuromuscular disorders, headaches, and sleep medicine. She blends her clinical research background with custom treatment approaches to offer comprehensive neurological care.",
    availableDays: ["Mon", "Tue", "Thu"],
    availabilityTime: "8:30 AM - 4:30 PM",
    rating: 4.9,
    reviewCount: 76,
    reviews: [
      {
        author: "Amit P.",
        rating: 5,
        text: "Dr. Patel was extremely helpful in managing my migraines. She offered multiple options and explained the pros and cons of each.",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZuI5eRnpWlN0AHcLAiqS-WyIFDWRarW8Jem4JOx5zPbbwhYcYNTUywwPCavbl03SXMv463t5hiw1OH8wmpcXCKrRR5GqZMu4sMCugN-UM3xlT2UIlznZeES6-ax0euZxrK1HxMMwi-RSE8xE6dQ3IvGsS5N2wxFK4OeWVRZLIGWjsNt3cHEWUEOJ3iXk26g8yb1ZggAGBaJYYa3NrU53PMKHj42c7J8QEMK9YrIOadoKtGmK0SmmfGHWQzwYX5tUPu0nX34KBIXa7",
      },
    ],
  },
  {
    id: "james-wilson",
    slug: "james-wilson",
    name: "Dr. James Wilson",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0gNn1gDonRjZv5zrdxM0aDG1V14mTXbZdGM_MgC_lCZvw0LVEQt_ondLvwPB9_oWUKGRUYfHcVlp-Z282FogqMjP-cMyWqQti6btJd9z95t8ALJKrn2DSrAq5M2UzEvvHG4du7BgfrVdddirj0mn5yuU_cuJ3i_JYdltfb4qU_UoU5gRZNDM-QE1QJwg8tiTyKAGWvN2uUiFQ4Nnvbg1sWCXtsoG_Qhzb3lTjNQnjURt3lLje1McDkOMHOf7AxFyY3ZibASvIoXf7",
    specialty: "Primary Care",
    specialtyIcon: "medical_services",
    qualifications: "DO, FAAFP",
    yearsExperience: 15,
    languages: ["English"],
    bio: "Dr. James Wilson emphasizes holistic and preventive primary care. He advocates for proactive lifestyle changes and manages chronic health conditions with empathetic, evidence-based approaches.",
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    availabilityTime: "8:00 AM - 5:00 PM",
    rating: 4.7,
    reviewCount: 154,
    reviews: [
      {
        author: "Robert H.",
        rating: 5,
        text: "Great family doctor. Reassuring and down-to-earth. The staff is friendly too.",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGKiaP8rvOhrg017dQxwtBe-ScldrZDo4AUFMQb2xMtrdQlyRB5RqzXVE1Jb0XYbekIDhW0AekXdHhWUveqdBXrEBUH_PxMLKfdh6PMMWvmR8ngQuY9F3TJ7YLTLxFtsoWV7WUJa8kTHygVrKvserejGbyH4d0MWAGyWy-FGV50-ZjfuguxQtk13LdPGc1dtPClVhqnDzEnjNnaRt503owF_ra4APso0TIdq55shPB-V4sbuPTr3EuruKb4NorOUoqfpnGOtO8AnSd",
      },
    ],
  },
  {
    id: "sarah-chen",
    slug: "sarah-chen",
    name: "Dr. Sarah Chen",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfKLTFwQTTqTlpFuJGvBvQ7NYsDlKq7SAr_5B5n2DvWfjzsJi4VrLyLqTovU44EjKIEKPOC9At-lUqCY3P2GuGiBaFyXDHCxGGTPIBR7QFBAzTuI1i9kq9Iw6bCRbPLTNsrk9g4OORRczauTZ1UQWD90VHISnEwfmBRhvsOuOQcHwZnLsD2jOf2oEqv6WH74E5gEyL_BJt7E0qRjAz6rkM5upNan2iGzZ32LF_ZcKiWwPcRc1TPyQ2P-LTTPH5yLeSEj-MHfNJIqqy",
    specialty: "General Surgery",
    specialtyIcon: "medical_services",
    qualifications: "MD, FACS",
    yearsExperience: 18,
    languages: ["English", "Mandarin"],
    bio: "Dr. Sarah Chen is a highly skilled general surgeon specializing in minimally invasive and laparoscopic techniques. She prioritizes patient comfort, safety, and rapid recovery throughout the surgical journey.",
    availableDays: ["Wed", "Fri"],
    availabilityTime: "9:00 AM - 3:00 PM",
    rating: 4.9,
    reviewCount: 112,
    reviews: [
      {
        author: "Karen L.",
        rating: 5,
        text: "Dr. Chen did my laparoscopic surgery. She was reassuring and the surgery went perfectly with minimal recovery time.",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGKiaP8rvOhrg017dQxwtBe-ScldrZDo4AUFMQb2xMtrdQlyRB5RqzXVE1Jb0XYbekIDhW0AekXdHhWUveqdBXrEBUH_PxMLKfdh6PMMWvmR8ngQuY9F3TJ7YLTLxFtsoWV7WUJa8kTHygVrKvserejGbyH4d0MWAGyWy-FGV50-ZjfuguxQtk13LdPGc1dtPClVhqnDzEnjNnaRt503owF_ra4APso0TIdq55shPB-V4sbuPTr3EuruKb4NorOUoqfpnGOtO8AnSd",
      },
    ],
  },
  {
    id: "omar-al-fayed",
    slug: "omar-al-fayed",
    name: "Dr. Omar Al-Fayed",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuk2lQGdw85sZt789_enutEfYw57_wnp8lBtzFiB5me0neIQtPV1GpzKdkdt9PoyQNAIR2-s9fVriedfN7FG40kfSi4WT8oFy-qdbAVoMmy993rdiNIb6yo2TJa9pVudP7H5IcFEOTfquK_FtXLPZ9mJcvSrTqsfPlM7lUnZ5dE_V5_Ng5ktJI07JUIuhk7PX0y_BOIbRlyRfbjF91n-M6k8XAij_n1D8UqA1SSV7y0NqdntOuQ7zBJeubKtnDfRnWaIDDUCS3YNDN",
    specialty: "Dermatology",
    specialtyIcon: "spa",
    qualifications: "MD, FAAD",
    yearsExperience: 10,
    languages: ["English", "Arabic"],
    bio: "Dr. Omar Al-Fayed offers comprehensive dermatological care, focusing on skin cancer screenings, acne treatments, and cosmetic dermatology. He aims to make everyone feel confident in their skin.",
    availableDays: ["Tue", "Thu"],
    availabilityTime: "8:00 AM - 4:00 PM",
    rating: 4.8,
    reviewCount: 87,
    reviews: [
      {
        author: "Zain B.",
        rating: 5,
        text: "Very knowledgeable dermatologist. Helped clear my cystic acne which I struggled with for years.",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZuI5eRnpWlN0AHcLAiqS-WyIFDWRarW8Jem4JOx5zPbbwhYcYNTUywwPCavbl03SXMv463t5hiw1OH8wmpcXCKrRR5GqZMu4sMCugN-UM3xlT2UIlznZeES6-ax0euZxrK1HxMMwi-RSE8xE6dQ3IvGsS5N2wxFK4OeWVRZLIGWjsNt3cHEWUEOJ3iXk26g8yb1ZggAGBaJYYa3NrU53PMKHj42c7J8QEMK9YrIOadoKtGmK0SmmfGHWQzwYX5tUPu0nX34KBIXa7",
      },
    ],
  },
  {
    id: "maya-thompson",
    slug: "maya-thompson",
    name: "Dr. Maya Thompson",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFXB8histqUCEEyai3_B2dmWBtuG0PceiJrxFp9iveQJd8rxKWEuWJ1ueKJBJ0ip3fc01-0HHgw3SAdER4vF_vyJp56qb_u4r1tCT0Fi2u14TWJHMeUzOp9eib1_U7CFPWJweUfdOQ7OzLM9DNAJfS2jkCKm37RkEN4DClnPc87JlfCeciJknzJUGjU74ulLha2xndI2tQSd0SIaP3OzgwSBlVeODp61KjLDErOzxaAKa-vwdacAcswg1W3twrU3o7WH41PZTzMHlW",
    specialty: "Psychiatry",
    specialtyIcon: "psychology",
    qualifications: "MD, APA",
    yearsExperience: 14,
    languages: ["English"],
    bio: "Dr. Maya Thompson is a compassionate psychiatrist providing diagnostic evaluations and medication management for various mental health conditions. She works collaboratively to foster long-term mental well-being.",
    availableDays: ["Mon", "Wed"],
    availabilityTime: "10:00 AM - 6:00 PM",
    rating: 4.9,
    reviewCount: 64,
    reviews: [
      {
        author: "Jessica M.",
        rating: 5,
        text: "Compassionate and non-judgmental. Dr. Thompson really listens and works with you to find the right medication balance.",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGKiaP8rvOhrg017dQxwtBe-ScldrZDo4AUFMQb2xMtrdQlyRB5RqzXVE1Jb0XYbekIDhW0AekXdHhWUveqdBXrEBUH_PxMLKfdh6PMMWvmR8ngQuY9F3TJ7YLTLxFtsoWV7WUJa8kTHygVrKvserejGbyH4d0MWAGyWy-FGV50-ZjfuguxQtk13LdPGc1dtPClVhqnDzEnjNnaRt503owF_ra4APso0TIdq55shPB-V4sbuPTr3EuruKb4NorOUoqfpnGOtO8AnSd",
      },
    ],
  },
  {
    id: "david-reynolds",
    slug: "david-reynolds",
    name: "Dr. David Reynolds",
    photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQiNFpF_ROhfM886WERjJlm6V9J_-9k4bdj1E6OTrg6X1FK0aUUOKOE1VVZGXHZJbv2t5HiH1WMApkEtZz82382S1m1U9DrSyETr5F07JYVDykzKnR8inrwNy22uO8G0zNE4FCFZoEoxc_iDXIoKhSRpJT9g-V6nSE5ohkRoEbCO-oxQ14IcxmtF-w-zfauat82kx4G6CoNQXDG35dcikITxcw9u5z83mwjzr-0nsoDhLEqYYlWgDOjS04a--pJKGRaPp9cKdNCXBy",
    specialty: "Orthopedics",
    specialtyIcon: "local_hospital",
    qualifications: "MD, FAAOS",
    yearsExperience: 16,
    languages: ["English"],
    bio: "Dr. David Reynolds is an orthopedic surgeon specializing in joint replacement, sports injuries, and reconstructive bone surgery. He is passionate about restoring patient mobility and function.",
    availableDays: ["Tue", "Fri"],
    availabilityTime: "9:00 AM - 4:00 PM",
    rating: 4.8,
    reviewCount: 110,
    reviews: [
      {
        author: "Tom W.",
        rating: 5,
        text: "Fixed my knee tear. Highly skilled surgeon and very communicative throughout the post-op care.",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZuI5eRnpWlN0AHcLAiqS-WyIFDWRarW8Jem4JOx5zPbbwhYcYNTUywwPCavbl03SXMv463t5hiw1OH8wmpcXCKrRR5GqZMu4sMCugN-UM3xlT2UIlznZeES6-ax0euZxrK1HxMMwi-RSE8xE6dQ3IvGsS5N2wxFK4OeWVRZLIGWjsNt3cHEWUEOJ3iXk26g8yb1ZggAGBaJYYa3NrU53PMKHj42c7J8QEMK9YrIOadoKtGmK0SmmfGHWQzwYX5tUPu0nX34KBIXa7",
      },
    ],
  },
];
