export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown content
  category: "General Health" | "Nutrition" | "Mental Health" | "Vaccinations" | "Clinic News";
  author: string;
  authorPhoto: string;
  date: string;
  readTime: string;
  featuredImage: string;
  isFeatured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "importance-of-checkups",
    slug: "importance-of-checkups",
    title: "The Importance of Annual Check-ups",
    excerpt: "Regular health screenings are vital for early detection of potential issues. Learn why scheduling your yearly physical is the most crucial step you can take for long-term wellness.",
    content: `
      <p>Regular health screenings are vital for early detection of potential health issues. Working closely with your family doctor can help you establish a baseline and maintain optimal well-being. Scheduling your yearly physical is one of the most proactive steps you can take for long-term health.</p>
      
      <h3>Why Annual Physicals Matter</h3>
      <p>Many chronic conditions, such as high blood pressure and type 2 diabetes, develop gradually without obvious symptoms in their early stages. During an annual physical, your physician checks key indicators like blood pressure, cholesterol levels, and blood sugar. Spotting trends early allows for simple lifestyle adjustments rather than complex treatments later.</p>

      <h3>Establishing a Health Partnership</h3>
      <p>An annual visit is more than just checking off boxes on a clinical checklist; it is an opportunity to cultivate a trust-based relationship with your care provider. You can discuss lifestyle choices, sleep patterns, mental health concerns, and family history details in an unhurried, comfortable setting.</p>

      <blockquote>"Preventative care is the cornerstone of modern medicine. It empowers patients with the knowledge and tools to stay healthy rather than simply treating illness." — Dr. Sarah Jenkins</blockquote>

      <h3>Key Components of an Annual Exam</h3>
      <ul>
        <li><strong>Vitals Audit:</strong> Assessment of blood pressure, heart rate, respiration, and body mass index.</li>
        <li><strong>Physical Examination:</strong> Evaluation of reflexes, lung sounds, heart health, and abdominal integrity.</li>
        <li><strong>Diagnostic Labs:</strong> Routine panels checking blood count, metabolic markers, and organ function.</li>
        <li><strong>Immunization Audit:</strong> Verification of booster shots and seasonal vaccinations.</li>
      </ul>
    `,
    category: "General Health",
    author: "Dr. Sarah Jenkins",
    authorPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn9dfNPnhao4mH0hlER2Lpm2JHTFAdhHVUslNCMht-T8tyojAt-qPlYPhXQWI4gVfsG9SZ8tkMbl9mGZ31wDCXi-EyIiDzygAf6bEPn_nlt4L59UpyMv2DvaWvLPDzXnslxXN0QSIFxfpVsbaN7HwHBfAW-M9vBp7W2up3Rk0zD1HBzlIlKwYOVMmhJ1-16TwoHk3z4HStTpKxDWiNp9R32EzDg3O6yBidZz94UW2b-KL3ZhQP43ZbctPTkXU62W_sMeP8z3dSv_-n",
    date: "Oct 12, 2024",
    readTime: "5 min read",
    featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuASNkdNTQQVQYFWQF_QwAmpQV9ar9OCWw7etOTTzX5RouuF1HOOD3saJSGCaWViC4IfbV4dlTH0P4-uQr382o6Fl_NT-t7D7uwohJ-4MseBLNIai3qq-lPDww0mdYfrX5jzvPpNblbR-jiP17Byz9Xp9zpbGqmWPMGZeW5q2zjaAGdEO5ShYCSQ1aFfYUJ80jXUFwl7ihD1G4HyjBFM1k8c0NBRJ9U8NeOhraK_KzKBNFGU3hsK-0qX3YUzopJWhU9miB-XC_efOsRe",
    isFeatured: true,
  },
  {
    id: "eating-for-immunity",
    slug: "eating-for-immunity",
    title: "Eating for Immunity This Winter",
    excerpt: "Discover the top 10 foods that naturally boost your immune system and help ward off seasonal colds and flu as the temperature drops.",
    content: `
      <p>As the winter months approach, our immune systems face increased challenges from seasonal viruses and cold weather. While no single food can guarantee immunity, a nutrient-dense diet rich in vitamins and minerals is crucial for maintaining your body's defenses.</p>

      <h3>Nutritional Cornerstones for Immune Support</h3>
      <p>To support your white blood cells and immune response, prioritize whole foods that supply key micronutrients:</p>
      <ul>
        <li><strong>Vitamin C:</strong> Citrus fruits, bell peppers, spinach, and broccoli are loaded with antioxidants that support cellular defense.</li>
        <li><strong>Zinc:</strong> Lean meats, seeds, lentils, and chickpeas are vital for immune cell development and division.</li>
        <li><strong>Vitamin D:</strong> While sunlight is the primary source, fortified dairy, eggs, and oily fish help sustain levels during darker months.</li>
        <li><strong>Probiotics:</strong> Fermented foods like yogurt, kefir, and kimchi nurture a healthy gut microbiome, which houses a major portion of your immune system.</li>
      </ul>

      <h3>Practical Wellness Tips</h3>
      <p>In addition to eating nutrient-dense meals, ensure you drink plenty of water, aim for 7-8 hours of sleep per night, and engage in regular, moderate exercise to keep circulation optimal.</p>
    `,
    category: "Nutrition",
    author: "Dietitian Mark",
    authorPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn9dfNPnhao4mH0hlER2Lpm2JHTFAdhHVUslNCMht-T8tyojAt-qPlYPhXQWI4gVfsG9SZ8tkMbl9mGZ31wDCXi-EyIiDzygAf6bEPn_nlt4L59UpyMv2DvaWvLPDzXnslxXN0QSIFxfpVsbaN7HwHBfAW-M9vBp7W2up3Rk0zD1HBzlIlKwYOVMmhJ1-16TwoHk3z4HStTpKxDWiNp9R32EzDg3O6yBidZz94UW2b-KL3ZhQP43ZbctPTkXU62W_sMeP8z3dSv_-n",
    date: "Nov 02, 2024",
    readTime: "4 min read",
    featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqhJ4fjxK8v4pW5D79Dt33ffBwLwuP7j6ra9qwsQRwn4QZ5MwdEw1L-5uSU0Iricek0CxmYkZc0ecu-JYaDkgOPSgYc5iib96QEhYPo4OT6vC_ojyYPEVMZU0onyo2I32mnBsgnQbKJ5MDT59ia20WwScODZlm5-xjpRcWvCrml8C81kQaETr4B6Xt6LFfRVOLMz8zLCz96ej7M3UJec76FzUBxaVvpDBXBrnK0z1d6vHWSeA2sdbAZOS6y4cliTOf9nX6ZsQZy1aP",
  },
  {
    id: "managing-workplace-stress",
    slug: "managing-workplace-stress",
    title: "Managing Workplace Stress",
    excerpt: "Practical techniques for maintaining boundaries, practicing mindfulness, and recognizing the signs of burnout before they affect your physical health.",
    content: `
      <p>Workplace demands can easily overflow into personal time, causing elevated cortisol levels and systemic stress. Over time, chronic occupational stress can manifest physically as headaches, fatigue, or cardiovascular strain. Learning to manage stress is key to sustaining emotional and physical well-being.</p>

      <h3>Recognizing Burnout Warnings</h3>
      <p>Watch for key emotional and behavioral markers that indicate overload: persistent exhaustion, irritability towards colleagues, feelings of detachment, and a drop in overall productivity.</p>

      <h3>Actionable Coping Strategies</h3>
      <p>Incorporate small wellness habits into your daily routine to stay balanced:</p>
      <ul>
        <li><strong>Time-Blocking:</strong> Designate strict hours for tasks and protect lunch hours away from screens.</li>
        <li><strong>Mindfulness Breaks:</strong> Take 3-5 minute breaks to complete breathing exercises between meetings.</li>
        <li><strong>Set Clear Boundaries:</strong> Turn off work communication apps after hours to allow cognitive recovery.</li>
      </ul>
    `,
    category: "Mental Health",
    author: "Dr. E. Rossi",
    authorPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn9dfNPnhao4mH0hlER2Lpm2JHTFAdhHVUslNCMht-T8tyojAt-qPlYPhXQWI4gVfsG9SZ8tkMbl9mGZ31wDCXi-EyIiDzygAf6bEPn_nlt4L59UpyMv2DvaWvLPDzXnslxXN0QSIFxfpVsbaN7HwHBfAW-M9vBp7W2up3Rk0zD1HBzlIlKwYOVMmhJ1-16TwoHk3z4HStTpKxDWiNp9R32EzDg3O6yBidZz94UW2b-KL3ZhQP43ZbctPTkXU62W_sMeP8z3dSv_-n",
    date: "Dec 18, 2024",
    readTime: "6 min read",
    featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXqTj4pxRgOjKCyL_WuTa-aV9BsCWtjtUS6awp5Oxa1PqNFhyvbwugqxFBkJebU_kSzz3iaRr48nAu5Mshqjc4NB1LhdFKRaivMu7AY-XUO6RmvvFl-6gAE9R0ODgnkUcQr6yzSHsv-q_YcRpIAcpxrFIPxpzpI1RC21QizUdXMvqzAJVbcY5VAFJGncwyG6wcHRlfCxB0l3JvLelBqWikp52VGxsY2jGsse2_rb4Fdvj4uiixv7-oIaGvpGRfy7gq-blyhn7awvcS",
  },
  {
    id: "flu-season-guidelines",
    slug: "flu-season-guidelines",
    title: "Flu Season 2024 Guidelines",
    excerpt: "Everything you need to know about this year's flu vaccine, who should get it, and when is the best time to schedule your family's appointments.",
    content: `
      <p>Influenza remains a major health concern during cold seasons. An annual flu shot is recommended for everyone over 6 months of age to reduce severity, infection rates, and spread within the community.</p>

      <h3>Optimal Vaccination Timing</h3>
      <p>For maximum seasonal protection, health authorities recommend scheduling your vaccination in early to mid-autumn. This allows your immune system about two weeks to build a robust antibody response before winter exposure spikes.</p>

      <h3>Who Benefits Most?</h3>
      <p>While recommended for all, vaccination is critical for high-risk categories: children under 5, adults over 65, pregnant women, and individuals with underlying metabolic or pulmonary conditions.</p>
    `,
    category: "Vaccinations",
    author: "Clinic Staff",
    authorPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn9dfNPnhao4mH0hlER2Lpm2JHTFAdhHVUslNCMht-T8tyojAt-qPlYPhXQWI4gVfsG9SZ8tkMbl9mGZ31wDCXi-EyIiDzygAf6bEPn_nlt4L59UpyMv2DvaWvLPDzXnslxXN0QSIFxfpVsbaN7HwHBfAW-M9vBp7W2up3Rk0zD1HBzlIlKwYOVMmhJ1-16TwoHk3z4HStTpKxDWiNp9R32EzDg3O6yBidZz94UW2b-KL3ZhQP43ZbctPTkXU62W_sMeP8z3dSv_-n",
    date: "Oct 05, 2024",
    readTime: "3 min read",
    featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLUrgBtpFRMLA6fOLdUJ0kJ0QS08bAycl3qexPfCboOW4SHXK7bRrGDto8Njz5O4OW0ykZuWsqLZbx_YwIDYdS78GH4N2ISTbT_2DYBYSrG_jCzPTYNl2tBeY2kvTC8poj9a8IthUuq3lLJekRXNDwKeqZkLIYzmmiAWLc8hHnrZzrtUBALHZ2K8TK-CRgATnAqPVLIk9d1hnC6r8p1S2Kpmw6d_nvv7SJfxCZnnf0nYpAAB8_IfmaJUe1dvx0v3Hi0PvwAy_r9iEE",
  },
  {
    id: "clinic-milestone-opening",
    slug: "clinic-milestone-opening",
    title: "LuminaHealth Unveils Wellness Suite",
    excerpt: "LuminaHealth has officially opened its new wellness diagnostic annex, bringing state-of-the-art ultrasound and imaging suites closer to our local community.",
    content: `
      <p>We are delighted to announce the grand opening of our advanced Wellness Suite. This new clinical wing represents a major milestone in our commitment to rendering premium, prompt diagnostic capabilities under one roof.</p>

      <h3>High-Resolution Imaging On-Site</h3>
      <p>The suite features digital radiology and 4D ultrasound equipment, permitting immediate scan reviews. Patients no longer need to travel to external hospitals for critical imaging, accelerating recovery planning.</p>

      <h3>Expanded Consulting Spaces</h3>
      <p>In addition to diagnostics, the wing houses three new consultations suites, welcoming new patients and reducing appointment wait times across general practice and wellness checks.</p>
    `,
    category: "Clinic News",
    author: "Lumina Management",
    authorPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn9dfNPnhao4mH0hlER2Lpm2JHTFAdhHVUslNCMht-T8tyojAt-qPlYPhXQWI4gVfsG9SZ8tkMbl9mGZ31wDCXi-EyIiDzygAf6bEPn_nlt4L59UpyMv2DvaWvLPDzXnslxXN0QSIFxfpVsbaN7HwHBfAW-M9vBp7W2up3Rk0zD1HBzlIlKwYOVMmhJ1-16TwoHk3z4HStTpKxDWiNp9R32EzDg3O6yBidZz94UW2b-KL3ZhQP43ZbctPTkXU62W_sMeP8z3dSv_-n",
    date: "Dec 01, 2024",
    readTime: "3 min read",
    featuredImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUZeIkI8mzTS1U9Xnh0fN9NiymQs-PlRRJlJIPShiXZxD5mSJACrA6Tybbl_7T8pHNo7ZMW8KlWZbZ-4VFQQgIT8CfEGFzfNTrKPhhkkpcjDB6IwD7aOnPUhv8iJvmETOOV2PJmSdywBfcw-K4OmVRk1wzIk-zCY1caTvGxi45WghMakJ31d_7wB3zTcNR0gO2QGZeS05dEKrHoe96zjDDaohwuiLlatFfMKrsaGhV7au-8gPj6Um5TaSuG7LnGQjzFfDscuAVLo5Y",
  },
];
