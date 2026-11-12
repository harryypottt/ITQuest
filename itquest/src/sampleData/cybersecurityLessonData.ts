export const cybersecurityLessons = [
  {
    id: 'cybersec-1',
    thumbnail: 'https://readdy.ai/api/search-image?query=Cyber%20security%20shield%20with%20padlock%20and%20protection%20layers%2C%20minimal%20flat%20illustration%2C%20soft%20rose%20and%20neutral%20tones%2C%20clean%20light%20background&width=640&height=360&seq=cs-thumb-1&orientation=landscape',
    title: 'Cybersecurity Fundamentals',
    category: 'cybersecurity',
    categoryName: 'Cybersecurity',
    description: 'Explore the CIA triad, threat modeling, attack vectors, defense strategies, and essential security principles.',
    difficulty: 2,
    estimatedMinutes: 45,
    orderIndex: 1,
    prerequisites: [],
    xpReward: 70,
    icon: 'ri-shield-check-line',
    content: [
      { type: 'heading', content: 'The CIA Triad' },
      { type: 'text', content: 'The CIA Triad is the foundational model of information security, standing for Confidentiality, Integrity, and Availability. Confidentiality ensures data is accessible only to authorized parties. Integrity guarantees data has not been tampered with. Availability ensures systems and data are accessible when needed. Every security measure maps back to protecting one or more of these three principles.' },
      { type: 'video', videoUrl: 'https://www.youtube.com/embed/SBcDGb9l6yo', videoTitle: 'The CIA Triad Explained — Confidentiality, Integrity, Availability' },
      { type: 'heading', content: 'Common Attack Vectors' },
      { type: 'text', content: 'Understanding common attack vectors is essential for defense. SQL Injection allows attackers to manipulate database queries through unsanitized input. Cross-Site Scripting (XSS) injects malicious scripts into web pages. Cross-Site Request Forgery (CSRF) tricks users into performing unwanted actions. Man-in-the-Middle (MITM) attacks intercept communication between two parties.' },
      { type: 'code', language: 'javascript', content: '// SQL Injection Example (VULNERABLE CODE)\n// DO NOT write code like this:\nconst query = `SELECT * FROM users WHERE email = \'${userInput}\'`;\n// Attacker input: \' OR \'1\'=\'1\' --\n// Results in: SELECT * FROM users WHERE email = \'\' OR \'1\'=\'1\' --\'\n\n// Safe: Parameterized Queries\nconst query = "SELECT * FROM users WHERE email = $1";\nconst result = await db.query(query, [userInput]);\n\n// XSS Prevention: Escape user output\nfunction escapeHTML(str) {\n  const div = document.createElement("div");\n  div.textContent = str;\n  return div.innerHTML;\n}\n\n// Or use a library like DOMPurify\nimport DOMPurify from "dompurify";\nconst safe = DOMPurify.sanitize(userInput);\n\n// CSRF Protection: Use tokens\n// Server generates a unique token per session\napp.use(csrf({ cookie: true }));\n\n// Client includes token in requests\nfetch("/api/submit", {\n  method: "POST",\n  headers: {\n    "CSRF-Token": getCsrfToken(),\n    "Content-Type": "application/json",\n  },\n  body: JSON.stringify(data),\n});' },
      { type: 'tip', content: 'Never, ever trust user input. Sanitize and validate everything that comes from the client. Use parameterized queries for database operations, escape output to prevent XSS, and implement proper authentication and authorization at every layer.' },
    ],
  },
  {
    id: 'cybersec-2',
    thumbnail: 'https://readdy.ai/api/search-image?query=Phishing%20email%20warning%20with%20alert%20icons%20and%20malicious%20link%20concept%2C%20cyber%20threat%20awareness%2C%20minimal%20flat%20design%2C%20soft%20rose%20tones%2C%20clean%20light%20background&width=640&height=360&seq=cs-thumb-2&orientation=landscape',
    title: 'Cybersecurity Threats and Attacks',
    category: 'cybersecurity',
    categoryName: 'Cybersecurity',
    description: 'Learn about common cybersecurity threats and attacks, how they work at a high level, and how users and organizations can recognize and prevent them.',
    difficulty: 1,
    estimatedMinutes: 45,
    orderIndex: 2,
    prerequisites: ['cybersec-1'],
    xpReward: 70,
    icon: 'ri-alarm-warning-line',
    content: [
      { type: 'heading', content: 'Understanding Cybersecurity Threats' },
      { type: 'text', content: 'A cybersecurity threat is a potential danger that can take advantage of a weakness in a computer system, network, application, or user behavior. Threats can affect confidentiality, integrity, and availability.' },

      { type: 'video', videoUrl: 'https://www.youtube.com/embed/eNfufhas2Fg', videoTitle: 'Phishing & Social Engineering — Recognizing the Human Threat' },

      { type: 'heading', content: 'Common Types of Cyber Attacks' },
      { type: 'text', content: 'Cyber attacks can take many forms. Some attacks target technical weaknesses, while others target people through deception and manipulation.' },

      { type: 'list', items: [
        'Phishing — Deceptive messages designed to trick users into revealing information or performing unsafe actions',
        'Malware — Malicious software designed to damage, disrupt, spy on, or gain unauthorized access to systems',
        'Ransomware — Malware that can restrict access to data or systems and demand payment',
        'Password attacks — Attempts to obtain or compromise account credentials',
        'Social engineering — Manipulating people into revealing information or performing actions',
        'Denial-of-service attacks — Attempts to make systems or services unavailable to legitimate users'
      ] },

      { type: 'heading', content: 'Phishing' },
      { type: 'text', content: 'Phishing is one of the most common forms of social engineering. An attacker may send an email, text message, or other communication that appears to come from a trusted organization. The goal may be to steal credentials, financial information, or other sensitive data.' },

      { type: 'code', language: 'text', content: 'Example phishing flow:\n\nAttacker\n   |\n   v\nFake message\n   |\n   v\nVictim clicks suspicious link\n   |\n   v\nFake login page\n   |\n   v\nVictim enters credentials\n   |\n   v\nInformation may be compromised' },

      { type: 'heading', content: 'Warning Signs of Phishing' },
      { type: 'list', items: [
        'Unexpected requests for passwords or personal information',
        'Urgent messages demanding immediate action',
        'Suspicious links or unfamiliar domains',
        'Unexpected attachments',
        'Messages pretending to be from trusted organizations',
        'Requests to bypass normal security procedures'
      ] },

      { type: 'heading', content: 'Malware' },
      { type: 'text', content: 'Malware is a general term for malicious software. Malware can have different purposes, including stealing information, disrupting services, damaging files, monitoring activity, or providing unauthorized access.' },

      { type: 'heading', content: 'Types of Malware' },
      { type: 'list', items: [
        'Virus — Malicious code that can attach to files and spread when executed',
        'Worm — Malware that can spread between systems or networks',
        'Trojan — Malicious software disguised as legitimate software',
        'Spyware — Software designed to monitor activity or collect information',
        'Ransomware — Malware that can prevent access to data or systems'
      ] },

      { type: 'heading', content: 'Social Engineering' },
      { type: 'text', content: 'Social engineering attacks exploit human behavior rather than relying only on technical vulnerabilities. Attackers may pretend to be administrators, employees, technical support staff, or other trusted individuals.' },

      { type: 'heading', content: 'Password Attacks' },
      { type: 'text', content: 'Passwords are frequently targeted because they can provide access to accounts and systems. Weak, reused, or exposed passwords increase the risk of unauthorized access.' },

      { type: 'heading', content: 'Basic Account Protection' },
      { type: 'list', items: [
        'Use long and unique passwords',
        'Avoid reusing passwords between important accounts',
        'Use multi-factor authentication',
        'Never share passwords with other people',
        'Use a trusted password manager when appropriate',
        'Monitor accounts for suspicious activity'
      ] },

      { type: 'heading', content: 'Denial-of-Service Attacks' },
      { type: 'text', content: 'A denial-of-service attack attempts to make a system or service unavailable to legitimate users. Distributed denial-of-service attacks use multiple sources to generate large amounts of traffic or requests toward a target.' },

      { type: 'heading', content: 'How to Reduce Cybersecurity Risks' },
      { type: 'list', items: [
        'Keep operating systems and applications updated',
        'Use strong authentication',
        'Be cautious with unexpected messages and links',
        'Use security software and firewalls where appropriate',
        'Maintain regular backups',
        'Limit user permissions',
        'Report suspicious activity'
      ] },

      { type: 'tip', content: 'When a message creates urgency and asks you to provide sensitive information or perform an unusual action, stop and verify the request using a trusted communication method.' },
    ],
  },
  {
    id: 'cybersec-3',
    thumbnail: 'https://readdy.ai/api/search-image?query=Authentication%20and%20access%20control%20concept%20with%20login%20keypad%2C%20fingerprint%20and%20multi%20factor%20security%20icons%2C%20minimal%20flat%20illustration%2C%20soft%20rose%20tones%2C%20clean%20light%20background&width=640&height=360&seq=cs-thumb-3&orientation=landscape',
    title: 'Authentication and Access Control',
    category: 'cybersecurity',
    categoryName: 'Cybersecurity',
    description: 'Learn how cybersecurity systems verify user identities and control access to resources using authentication, authorization, passwords, MFA, and least privilege.',
    difficulty: 2,
    estimatedMinutes: 50,
    orderIndex: 3,
    prerequisites: ['cybersec-2'],
    xpReward: 80,
    icon: 'ri-lock-password-line',
    content: [
      { type: 'heading', content: 'Authentication and Authorization' },
      { type: 'text', content: 'Authentication is the process of verifying who a user or system is. Authorization determines what an authenticated user or system is allowed to access or perform.' },

      { type: 'video', videoUrl: 'https://www.youtube.com/embed/L3alw3iXaio', videoTitle: 'What is Multi-Factor Authentication (MFA)?' },

      { type: 'code', language: 'text', content: 'USER\n  |\n  v\nAUTHENTICATION\n"Who are you?"\n  |\n  v\nAUTHORIZATION\n"What can you access?"\n  |\n  v\nPROTECTED RESOURCE' },

      { type: 'heading', content: 'Authentication Factors' },
      { type: 'text', content: 'Authentication can use different types of evidence to verify identity. These factors can be combined to make authentication stronger.' },

      { type: 'list', items: [
        'Something you know — Password or PIN',
        'Something you have — Security key, authenticator device, or trusted device',
        'Something you are — Biometric characteristic such as a fingerprint'
      ] },

      { type: 'heading', content: 'Multi-Factor Authentication' },
      { type: 'text', content: 'Multi-factor authentication, or MFA, requires two or more different authentication factors. MFA can make an account more difficult to compromise when a password is stolen.' },

      { type: 'heading', content: 'Password Security' },
      { type: 'text', content: 'Passwords should be long, unique, and difficult to guess. Organizations should protect stored passwords using appropriate password-hashing techniques rather than storing passwords as plain text.' },

      { type: 'code', language: 'text', content: 'User enters password\n        |\n        v\nSecure password verification\n        |\n        v\nAuthentication result\n        |\n   +----+----+\n   |         |\n Success    Failure' },

      { type: 'heading', content: 'Authorization' },
      { type: 'text', content: 'Authorization controls which resources and actions a user can access. For example, a student may be allowed to view their own academic records but may not be allowed to modify another student\'s records.' },

      { type: 'heading', content: 'Role-Based Access Control' },
      { type: 'text', content: 'Role-Based Access Control, or RBAC, assigns permissions according to roles. This allows organizations to manage access more consistently.' },

      { type: 'code', language: 'text', content: 'Administrator\n  ├── Manage users\n  ├── Manage courses\n  └── View reports\n\nInstructor\n  ├── Manage assigned courses\n  └── Manage grades\n\nStudent\n  ├── View courses\n  └── View own records' },

      { type: 'heading', content: 'Principle of Least Privilege' },
      { type: 'text', content: 'The principle of least privilege means that users and systems should receive only the permissions necessary to perform their tasks. Limiting permissions can reduce the damage caused by compromised accounts or mistakes.' },

      { type: 'heading', content: 'Account Management' },
      { type: 'list', items: [
        'Create accounts only when necessary',
        'Assign appropriate permissions',
        'Remove or disable unused accounts',
        'Review permissions regularly',
        'Protect administrator accounts',
        'Use MFA for sensitive accounts'
      ] },

      { type: 'heading', content: 'Session Security' },
      { type: 'text', content: 'After a successful login, applications often maintain a session or use an authentication token. These credentials should be protected because someone who obtains a valid session credential may be able to access protected resources.' },

      { type: 'tip', content: 'Remember the difference: authentication verifies identity, while authorization determines permissions.' },
    ],
  },
  {
    id: 'cybersec-4',
    thumbnail: 'https://readdy.ai/api/search-image?query=Network%20security%20diagram%20with%20connected%20nodes%20and%20a%20firewall%20blocking%20traffic%2C%20minimal%20flat%20design%2C%20soft%20rose%20and%20neutral%20tones%2C%20clean%20light%20background&width=640&height=360&seq=cs-thumb-4&orientation=landscape',
    title: 'Network Security Fundamentals',
    category: 'cybersecurity',
    categoryName: 'Cybersecurity',
    description: 'Learn fundamental networking concepts and understand how firewalls, secure protocols, network segmentation, and monitoring help protect systems.',
    difficulty: 2,
    estimatedMinutes: 55,
    orderIndex: 4,
    prerequisites: ['cybersec-3'],
    xpReward: 85,
    icon: 'ri-router-line',
    content: [
      { type: 'heading', content: 'What is Network Security?' },
      { type: 'text', content: 'Network security is the practice of protecting network infrastructure, devices, communications, and services from unauthorized access, misuse, disruption, and other threats.' },

      { type: 'video', videoUrl: 'https://www.youtube.com/embed/K4ilFsm2GvA', videoTitle: 'Firewall & Network Security Fundamentals Explained' },

      { type: 'heading', content: 'Basic Network Components' },
      { type: 'list', items: [
        'Router — Directs traffic between networks',
        'Switch — Connects devices within a local network',
        'Firewall — Controls network traffic according to security rules',
        'Access Point — Provides wireless network connectivity',
        'Server — Provides services or resources to clients'
      ] },

      { type: 'heading', content: 'IP Addresses' },
      { type: 'text', content: 'An IP address identifies a device or network interface for communication over an IP network. IPv4 uses 32-bit addresses, while IPv6 uses 128-bit addresses.' },

      { type: 'code', language: 'text', content: 'IPv4:\n192.168.1.10\n\nIPv6:\n2001:db8::10' },

      { type: 'heading', content: 'Ports and Network Services' },
      { type: 'text', content: 'Network applications commonly use ports to identify services. Knowing which services are exposed on a system is important for network administration and security.' },

      { type: 'list', items: [
        'HTTP — Commonly uses port 80',
        'HTTPS — Commonly uses port 443',
        'SSH — Commonly uses port 22',
        'DNS — Commonly uses port 53'
      ] },

      { type: 'heading', content: 'Firewalls' },
      { type: 'text', content: 'A firewall controls network traffic based on configured rules. It can allow legitimate traffic while blocking traffic that does not meet the defined security requirements.' },

      { type: 'code', language: 'text', content: 'Internet\n   |\n   v\n[ FIREWALL ]\n   |\n   +---- Allowed Traffic ----> Internal Network\n   |\n   +---- Blocked Traffic ----> Denied' },

      { type: 'heading', content: 'HTTPS and Secure Communication' },
      { type: 'text', content: 'HTTPS uses TLS to protect communication between a client and server. It helps provide encryption in transit and helps protect data from unauthorized observation or modification while it travels across the network.' },

      { type: 'heading', content: 'Network Segmentation' },
      { type: 'text', content: 'Network segmentation divides a network into separate areas. Sensitive systems can be isolated from less trusted systems, helping reduce unnecessary communication and limit the potential impact of a security incident.' },

      { type: 'code', language: 'text', content: 'Internet\n   |\n   v\nFirewall\n   |\n   +------ Web Network\n   |\n   +------ Application Network\n   |\n   +------ Database Network\n   |\n   +------ Management Network' },

      { type: 'heading', content: 'Network Monitoring' },
      { type: 'text', content: 'Network monitoring involves observing traffic, connections, logs, and system activity. Monitoring can help identify unusual behavior, performance problems, and possible security incidents.' },

      { type: 'heading', content: 'Basic Network Security Practices' },
      { type: 'list', items: [
        'Use secure communication protocols',
        'Configure firewalls appropriately',
        'Disable unnecessary services',
        'Keep network devices updated',
        'Change default credentials',
        'Separate sensitive network areas when appropriate',
        'Monitor important network activity'
      ] },

      { type: 'tip', content: 'A good network security strategy minimizes unnecessary exposure. Services and devices should only be accessible to users or systems that actually need them.' },
    ],
  },
  {
    id: 'cybersec-5',
    thumbnail: 'https://readdy.ai/api/search-image?query=Cryptography%20concept%20with%20encryption%20keys%20and%20a%20padlock%20over%20ciphertext%20code%2C%20minimal%20flat%20illustration%2C%20soft%20rose%20tones%2C%20clean%20light%20background&width=640&height=360&seq=cs-thumb-5&orientation=landscape',
    title: 'Cryptography Fundamentals',
    category: 'cybersecurity',
    categoryName: 'Cybersecurity',
    description: 'Understand the fundamentals of cryptography, including encryption, decryption, hashing, keys, symmetric encryption, asymmetric encryption, and digital signatures.',
    difficulty: 3,
    estimatedMinutes: 55,
    orderIndex: 5,
    prerequisites: ['cybersec-4'],
    xpReward: 95,
    icon: 'ri-key-2-line',
    content: [
      { type: 'heading', content: 'What is Cryptography?' },
      { type: 'text', content: 'Cryptography is the practice of using mathematical techniques to protect information. It is commonly used to provide confidentiality, integrity, authentication, and other security properties.' },

      { type: 'video', videoUrl: 'https://www.youtube.com/embed/2zxiWSitAlE', videoTitle: 'Cryptography Fundamentals — Symmetric & Asymmetric Encryption' },

      { type: 'heading', content: 'Encryption and Decryption' },
      { type: 'text', content: 'Encryption transforms readable information, called plaintext, into an encoded form called ciphertext. Decryption reverses the process using an appropriate key.' },

      { type: 'code', language: 'text', content: 'PLAINTEXT\n    |\n    | Encryption + Key\n    v\nCIPHERTEXT\n    |\n    | Decryption + Key\n    v\nPLAINTEXT' },

      { type: 'heading', content: 'Encryption Keys' },
      { type: 'text', content: 'A cryptographic key is information used by a cryptographic algorithm to perform an operation such as encryption or decryption. The security of a cryptographic system depends heavily on protecting keys appropriately.' },

      { type: 'heading', content: 'Symmetric Encryption' },
      { type: 'text', content: 'Symmetric encryption uses the same secret key for encryption and decryption. It can be efficient for protecting large amounts of data, but the communicating parties need a secure way to establish or exchange the secret key.' },

      { type: 'code', language: 'text', content: 'Sender\n  |\n  | Plaintext\n  v\n[ Encryption ]\n  |\n  | Shared Secret Key\n  v\nCiphertext\n  |\n  v\n[ Decryption ]\n  |\n  v\nReceiver' },

      { type: 'heading', content: 'Asymmetric Encryption' },
      { type: 'text', content: 'Asymmetric cryptography uses a pair of mathematically related keys: a public key and a private key. The public key can generally be shared, while the private key should be protected.' },

      { type: 'code', language: 'text', content: 'PUBLIC KEY\n    |\n    v\nUsed by others\n    |\n    v\nEncrypted information\n    |\n    v\nPRIVATE KEY\n    |\n    v\nUsed by owner for appropriate cryptographic operation' },

      { type: 'heading', content: 'Hashing' },
      { type: 'text', content: 'Hashing converts input data into a fixed-length value called a hash. Cryptographic hash functions are designed so that small changes in input produce significantly different outputs. Hashing is commonly used for integrity checks and password storage systems.' },

      { type: 'code', language: 'text', content: 'Input Data\n    |\n    v\nHash Function\n    |\n    v\nFixed-Length Hash\n\n"Hello"\n   |\n   v\nHash A\n\n"hello"\n   |\n   v\nDifferent Hash B' },

      { type: 'heading', content: 'Encryption vs Hashing' },
      { type: 'list', items: [
        'Encryption is designed to protect information so it can later be recovered through decryption',
        'Hashing is designed to produce a one-way representation useful for integrity and other security purposes',
        'Encrypted data can be decrypted with the appropriate key',
        'A properly designed cryptographic hash is not intended to be reversed to recover the original input'
      ] },

      { type: 'heading', content: 'Digital Signatures' },
      { type: 'text', content: 'Digital signatures use asymmetric cryptography to provide evidence that data was signed by the holder of a private key and that the signed data has not been altered. They are commonly used to support authenticity and integrity.' },

      { type: 'heading', content: 'Cryptography in Everyday Applications' },
      { type: 'list', items: [
        'HTTPS protects web communications',
        'Encrypted messaging protects communications',
        'Password systems use secure password hashing',
        'Digital signatures help verify software and documents',
        'Encrypted storage protects sensitive information'
      ] },

      { type: 'tip', content: 'Never create your own cryptographic algorithm for a real application. Use well-established cryptographic algorithms and trusted security libraries.' },
    ],
  },
];