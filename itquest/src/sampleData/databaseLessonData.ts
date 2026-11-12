export const databaseLessons = [
  {
    id: 'database-1',
    thumbnail: 'https://readdy.ai/api/search-image?query=Database%20tables%20with%20rows%20and%20columns%20and%20a%20schema%20diagram%2C%20data%20storage%20concept%2C%20minimal%20flat%20design%20aesthetic%2C%20soft%20cool%20neutral%20tones%2C%20clean%20light%20background&width=640&height=360&seq=db-thumb-1&orientation=landscape',
    title: 'Introduction to Databases',
    category: 'database',
    categoryName: 'Database Administrator',
    description: 'Learn database fundamentals: relational vs NoSQL, SQL basics, schema design, normalization, and indexing.',
    difficulty: 1,
    estimatedMinutes: 35,
    orderIndex: 1,
    prerequisites: [],
    xpReward: 50,
    icon: 'ri-database-2-line',
    content: [
      { type: 'heading', content: 'Relational vs NoSQL Databases' },
      { type: 'text', content: 'Databases are organized collections of structured data. Relational databases (PostgreSQL, MySQL, SQLite) store data in tables with predefined schemas and use SQL for queries. They enforce data integrity through constraints, relationships, and ACID transactions. NoSQL databases (MongoDB, Redis, Cassandra) offer flexible schemas, horizontal scaling, and are optimized for specific data models like documents, key-value pairs, or graphs.' },
      { type: 'video', videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY', videoTitle: 'SQL & Database Crash Course for Beginners' },
      { type: 'heading', content: 'SQL Fundamentals' },
      { type: 'text', content: 'SQL (Structured Query Language) is the standard language for relational database management. The four fundamental operations are CRUD: Create (INSERT), Read (SELECT), Update (UPDATE), and Delete (DELETE). SELECT queries can combine multiple tables using JOINs, filter with WHERE, group with GROUP BY, and sort with ORDER BY.' },
      { type: 'code', language: 'sql', content: '-- Creating Tables\nCREATE TABLE users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email VARCHAR(255) UNIQUE NOT NULL,\n  full_name VARCHAR(255) NOT NULL,\n  current_level INT DEFAULT 1,\n  total_xp INT DEFAULT 0,\n  created_at TIMESTAMP DEFAULT NOW(),\n  \n  CONSTRAINT valid_level CHECK (current_level >= 1),\n  CONSTRAINT valid_xp CHECK (total_xp >= 0)\n);\n\nCREATE TABLE quests (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  title VARCHAR(255) NOT NULL,\n  category VARCHAR(50) NOT NULL,\n  difficulty INT NOT NULL CHECK (difficulty BETWEEN 1 AND 5),\n  xp_reward INT NOT NULL DEFAULT 100,\n  is_active BOOLEAN DEFAULT true\n);\n\n-- Inserting Data\nINSERT INTO users (email, full_name, current_level, total_xp)\nVALUES (\'alex@example.com\', \'Alex Chen\', 5, 1250);\n\n-- Selecting with Filters\nSELECT full_name, current_level, total_xp\nFROM users\nWHERE total_xp >= 1000\n  AND current_level BETWEEN 5 AND 20\nORDER BY total_xp DESC\nLIMIT 10;\n\n-- JOINs\nSELECT u.full_name, q.title, qp.status\nFROM quest_progress qp\nINNER JOIN users u ON qp.user_id = u.id\nINNER JOIN quests q ON qp.quest_id = q.id\nWHERE qp.status = \'in_progress\'\nORDER BY qp.started_at DESC;\n\n-- Aggregation\nSELECT \n  category,\n  COUNT(*) as quest_count,\n  AVG(difficulty) as avg_difficulty,\n  SUM(xp_reward) as total_possible_xp\nFROM quests\nWHERE is_active = true\nGROUP BY category\nHAVING COUNT(*) >= 2\nORDER BY total_possible_xp DESC;\n\n-- Updating\nUPDATE users\nSET total_xp = total_xp + 100,\n    current_level = CASE \n      WHEN total_xp + 100 >= current_level * 500 \n      THEN current_level + 1 \n      ELSE current_level \n    END\nWHERE id = \'user-uuid-here\';' },
      { type: 'heading', content: 'Database Normalization' },
      { type: 'text', content: 'Normalization is the process of organizing data to reduce redundancy and improve integrity. The normal forms (1NF, 2NF, 3NF, BCNF) provide progressively stricter rules. First Normal Form (1NF): each column has atomic values, no repeating groups. Second Normal Form (2NF): 1NF + no partial dependencies. Third Normal Form (3NF): 2NF + no transitive dependencies. While normalization reduces redundancy, sometimes denormalization is used for read performance.' },
      { type: 'code', language: 'sql', content: '-- First Normal Form (1NF): Atomic values, no repeating groups\n-- Wrong: storing multiple values in one column\n-- | id | name  | skills               |\n-- | 1  | Alex  | HTML, CSS, JavaScript |\n\n-- Correct: separate rows or separate table\nCREATE TABLE user_skills (\n  user_id UUID REFERENCES users(id),\n  skill VARCHAR(100),\n  PRIMARY KEY (user_id, skill)\n);\n\n-- Second Normal Form (2NF): No partial dependencies\n-- Wrong: non-key column depends on part of composite key\n-- | order_id | product_id | product_name | quantity |\n-- product_name depends only on product_id, not on order_id\n\n-- Correct: split into separate tables\nCREATE TABLE orders (order_id UUID PRIMARY KEY, ...);\nCREATE TABLE products (product_id UUID PRIMARY KEY, product_name VARCHAR(255));\nCREATE TABLE order_items (\n  order_id UUID REFERENCES orders(id),\n  product_id UUID REFERENCES products(id),\n  quantity INT,\n  PRIMARY KEY (order_id, product_id)\n);\n\n-- Third Normal Form (3NF): No transitive dependencies\n-- Wrong: non-key column depends on another non-key column\n-- | student_id | school_id | school_name |\n-- school_name depends on school_id, not directly on student_id\n-- Correct: school_name belongs in schools table' },
      { type: 'tip', content: 'Index columns that are frequently used in WHERE, JOIN, and ORDER BY clauses. But do not over-index — each index slows down INSERT/UPDATE/DELETE operations. Use EXPLAIN ANALYZE to check if your queries are actually using the indexes you created.' },
    ],
  },
  {
    id: 'dataadmin-2',
    thumbnail: 'https://readdy.ai/api/search-image?query=SQL%20query%20editor%20showing%20code%20and%20database%20tables%2C%20data%20querying%20concept%2C%20minimal%20flat%20design%20aesthetic%2C%20soft%20cool%20neutral%20tones%2C%20clean%20light%20background&width=640&height=360&seq=dataadmin-2-thumb&orientation=landscape',
    title: 'SQL Fundamentals',
    category: 'database',
    categoryName: 'Database Administrator',
    description: 'Learn the fundamentals of SQL, including retrieving, inserting, updating, and deleting data, filtering results, sorting records, using functions, and combining data from multiple tables.',
    difficulty: 1,
    estimatedMinutes: 50,
    orderIndex: 2,
    prerequisites: ['database-1'],
    xpReward: 80,
    icon: 'ri-code-s-slash-line',
    content: [
      { type: 'heading', content: 'What is SQL?' },
      { type: 'text', content: 'Structured Query Language (SQL) is a language used to communicate with relational databases. SQL allows users to retrieve, insert, update, and delete data, as well as create and modify database structures. It is one of the most important skills for database administrators and professionals who work with relational data.' },

      { type: 'heading', content: 'SQL and Relational Databases' },
      { type: 'text', content: 'SQL is commonly used with relational database management systems such as MySQL, PostgreSQL, Microsoft SQL Server, and Oracle Database. Although different database systems may have their own extensions and features, the basic SQL concepts are similar across most relational databases.' },

      { type: 'heading', content: 'The SELECT Statement' },
      { type: 'text', content: 'The SELECT statement is used to retrieve data from one or more database tables. You can select specific columns or use an asterisk (*) to retrieve all columns.' },

      { type: 'code', language: 'sql', content: '-- Select specific columns\nSELECT name, email\nFROM students;\n\n-- Select all columns\nSELECT *\nFROM students;' },

      { type: 'heading', content: 'Filtering Data with WHERE' },
      { type: 'text', content: 'The WHERE clause filters records based on a specified condition. Filtering allows you to retrieve only the data that matches your requirements.' },

      { type: 'code', language: 'sql', content: '-- Find students who are 20 years old\nSELECT *\nFROM students\nWHERE age = 20;\n\n-- Find students older than 18\nSELECT *\nFROM students\nWHERE age > 18;\n\n-- Find a specific student\nSELECT *\nFROM students\nWHERE student_id = 1;' },

      { type: 'heading', content: 'Comparison and Logical Operators' },
      { type: 'text', content: 'SQL provides comparison and logical operators that can be used to create more specific conditions. Common operators include =, !=, >, <, >=, and <=. Logical operators such as AND, OR, and NOT can combine multiple conditions.' },

      { type: 'code', language: 'sql', content: '-- AND: both conditions must be true\nSELECT *\nFROM students\nWHERE age >= 18 AND course = \'IT\';\n\n-- OR: either condition can be true\nSELECT *\nFROM students\nWHERE course = \'IT\' OR course = \'CS\';\n\n-- NOT: excludes a condition\nSELECT *\nFROM students\nWHERE NOT course = \'IT\';' },

      { type: 'heading', content: 'Sorting Data with ORDER BY' },
      { type: 'text', content: 'The ORDER BY clause sorts query results. By default, results are sorted in ascending order. DESC can be used to sort values in descending order.' },

      { type: 'code', language: 'sql', content: '-- Sort from youngest to oldest\nSELECT *\nFROM students\nORDER BY age ASC;\n\n-- Sort from oldest to youngest\nSELECT *\nFROM students\nORDER BY age DESC;' },

      { type: 'heading', content: 'Limiting Results' },
      { type: 'text', content: 'Database systems provide ways to limit the number of records returned by a query. For example, LIMIT is commonly used in MySQL and PostgreSQL to return only a specified number of rows.' },

      { type: 'code', language: 'sql', content: '-- Return the first 5 records\nSELECT *\nFROM students\nLIMIT 5;' },

      { type: 'heading', content: 'Inserting Data' },
      { type: 'text', content: 'The INSERT INTO statement adds new records to a table. The values provided must match the columns specified in the statement.' },

      { type: 'code', language: 'sql', content: 'INSERT INTO students (student_id, name, email, age)\nVALUES (1, \'John Smith\', \'john@example.com\', 20);' },

      { type: 'heading', content: 'Updating Data' },
      { type: 'text', content: 'The UPDATE statement modifies existing records. A WHERE clause should normally be used to specify which records should be changed. Without a WHERE clause, an UPDATE statement can modify every record in the table.' },

      { type: 'code', language: 'sql', content: 'UPDATE students\nSET email = \'john.smith@example.com\'\nWHERE student_id = 1;' },

      { type: 'tip', content: 'Always check your WHERE condition before running UPDATE or DELETE statements. An incorrect or missing WHERE clause can modify or remove many more records than intended.' },

      { type: 'heading', content: 'Deleting Data' },
      { type: 'text', content: 'The DELETE statement removes records from a table. Like UPDATE, DELETE should normally use a WHERE clause when you only want to remove specific records.' },

      { type: 'code', language: 'sql', content: '-- Delete one specific record\nDELETE FROM students\nWHERE student_id = 1;' },

      { type: 'heading', content: 'Aggregate Functions' },
      { type: 'text', content: 'Aggregate functions perform calculations on groups of records. Common functions include COUNT for counting records, SUM for calculating totals, AVG for calculating averages, MIN for finding the smallest value, and MAX for finding the largest value.' },

      { type: 'code', language: 'sql', content: '-- Count students\nSELECT COUNT(*)\nFROM students;\n\n-- Calculate the average age\nSELECT AVG(age)\nFROM students;\n\n-- Find the oldest student\nSELECT MAX(age)\nFROM students;' },

      { type: 'heading', content: 'GROUP BY' },
      { type: 'text', content: 'The GROUP BY clause groups records that have the same values in one or more columns. It is commonly used together with aggregate functions to produce summaries of data.' },

      { type: 'code', language: 'sql', content: '-- Count students in each course\nSELECT course, COUNT(*) AS total_students\nFROM students\nGROUP BY course;' },

      { type: 'heading', content: 'Joining Tables' },
      { type: 'text', content: 'A database often stores related information in separate tables. SQL JOIN operations allow data from multiple tables to be combined using related columns, such as a primary key and foreign key.' },

      { type: 'code', language: 'sql', content: 'SELECT students.name, courses.course_name\nFROM students\nINNER JOIN courses\nON students.course_id = courses.course_id;' },

      { type: 'heading', content: 'Common SQL JOIN Types' },
      { type: 'list', items: [
        'INNER JOIN — Returns records that have matching values in both tables',
        'LEFT JOIN — Returns all records from the left table and matching records from the right table',
        'RIGHT JOIN — Returns all records from the right table and matching records from the left table',
        'FULL OUTER JOIN — Returns matching and non-matching records from both tables where supported'
      ] },

      { type: 'heading', content: 'SQL NULL Values' },
      { type: 'text', content: 'NULL represents a missing, unknown, or unavailable value in a database. NULL is different from zero or an empty string. SQL provides IS NULL and IS NOT NULL for checking whether a value is missing.' },

      { type: 'code', language: 'sql', content: '-- Find records with no email\nSELECT *\nFROM students\nWHERE email IS NULL;\n\n-- Find records that have an email\nSELECT *\nFROM students\nWHERE email IS NOT NULL;' },

      { type: 'heading', content: 'SQL Data Definition Language' },
      { type: 'text', content: 'SQL can also be used to create and modify database structures. Commands such as CREATE TABLE, ALTER TABLE, and DROP TABLE are used to manage database objects.' },

      { type: 'code', language: 'sql', content: '-- Create a table\nCREATE TABLE students (\n    student_id INT PRIMARY KEY,\n    name VARCHAR(100),\n    email VARCHAR(100),\n    age INT\n);\n\n-- Add a column\nALTER TABLE students\nADD course VARCHAR(100);' },

      { type: 'heading', content: 'Why SQL Matters for Data Administrators' },
      { type: 'text', content: 'SQL is a core skill for data administrators because it provides a direct way to work with relational databases. Administrators use SQL to inspect data, manage database structures, troubleshoot problems, monitor information, manage users and permissions, and support applications that depend on databases.' },

      { type: 'tip', content: 'Practice SQL regularly using a sample database. Focus on SELECT, WHERE, ORDER BY, INSERT, UPDATE, DELETE, aggregate functions, GROUP BY, and JOIN before moving to advanced database administration topics.' },
    ],
  },
  {
    id: 'dataadmin-3',
    thumbnail: 'https://readdy.ai/api/search-image?query=Entity%20relationship%20diagram%20with%20tables%2C%20keys%20and%20connecting%20lines%2C%20database%20schema%20design%20concept%2C%20minimal%20flat%20design%20aesthetic%2C%20soft%20cool%20neutral%20tones%2C%20clean%20light%20background&width=640&height=360&seq=dataadmin-3-thumb&orientation=landscape',
    title: 'Database Design & Normalization',
    category: 'database',
    categoryName: 'Database Administrator',
    description: 'Learn how to design efficient relational databases using entities, attributes, keys, relationships, constraints, and normalization techniques to reduce data redundancy and maintain data integrity.',
    difficulty: 2,
    estimatedMinutes: 55,
    orderIndex: 3,
    prerequisites: ['dataadmin-2'],
    xpReward: 90,
    icon: 'ri-database-line',
    content: [
      { type: 'heading', content: 'What is Database Design?' },
      { type: 'text', content: 'Database design is the process of planning how data will be organized, stored, and related within a database. A well-designed database makes information easier to manage, reduces unnecessary duplication, improves data integrity, and allows applications to retrieve information efficiently.' },

      { type: 'heading', content: 'Entities and Attributes' },
      { type: 'text', content: 'An entity represents a real-world object or concept that needs to be stored in a database. Examples include students, customers, products, employees, and orders. Attributes describe the properties of an entity.' },

      { type: 'code', language: 'text', content: 'Entity: Student\n\nAttributes:\n- student_id\n- name\n- email\n- age\n- course' },

      { type: 'heading', content: 'Tables and Relationships' },
      { type: 'text', content: 'In a relational database, entities are commonly represented as tables. Relationships connect related tables using keys. For example, a customer can have many orders, creating a one-to-many relationship between the Customers and Orders tables.' },

      { type: 'list', items: [
        'One-to-One — One record is associated with one record in another table',
        'One-to-Many — One record can be associated with many records',
        'Many-to-Many — Many records can be associated with many records'
      ] },

      { type: 'heading', content: 'Primary Keys' },
      { type: 'text', content: 'A primary key uniquely identifies each record in a table. A good primary key should uniquely identify a record and should not change unnecessarily. Primary keys are also commonly referenced by foreign keys in related tables.' },

      { type: 'code', language: 'sql', content: 'CREATE TABLE customers (\n    customer_id INT PRIMARY KEY,\n    name VARCHAR(100),\n    email VARCHAR(100)\n);' },

      { type: 'heading', content: 'Foreign Keys' },
      { type: 'text', content: 'A foreign key is a column that references a key in another table. Foreign keys establish relationships between tables and help maintain referential integrity by ensuring that related records reference valid data.' },

      { type: 'code', language: 'sql', content: 'CREATE TABLE orders (\n    order_id INT PRIMARY KEY,\n    customer_id INT,\n    order_date DATE,\n    FOREIGN KEY (customer_id)\n        REFERENCES customers(customer_id)\n);' },

      { type: 'heading', content: 'What is Normalization?' },
      { type: 'text', content: 'Normalization is the process of organizing data into related tables to reduce unnecessary duplication and improve data consistency. Instead of storing the same information repeatedly, related information is separated into appropriate tables and connected using keys.' },

      { type: 'heading', content: 'Problems Caused by Poor Database Design' },
      { type: 'text', content: 'Poor database design can cause duplicate data, inconsistent information, difficult updates, and accidental data loss. These problems are commonly referred to as data anomalies.' },

      { type: 'list', items: [
        'Update Anomaly — The same information must be changed in multiple records',
        'Insert Anomaly — Data cannot be added without adding unrelated information',
        'Delete Anomaly — Removing one record accidentally removes other important information'
      ] },

      { type: 'heading', content: 'First Normal Form (1NF)' },
      { type: 'text', content: 'First Normal Form requires each column to contain atomic values and prevents repeating groups of related values from being stored in the same row. Each field should contain a single value rather than a list of values.' },

      { type: 'code', language: 'text', content: 'Not properly normalized:\n\nStudent ID | Name  | Courses\n-----------|-------|--------------------\n1          | John  | IT, CS, Math\n\nBetter design:\n\nStudents\nStudent ID | Name\n-----------|------\n1          | John\n\nStudentCourses\nStudent ID | Course\n-----------|-------\n1          | IT\n1          | CS\n1          | Math' },

      { type: 'heading', content: 'Second Normal Form (2NF)' },
      { type: 'text', content: 'Second Normal Form requires a table to already satisfy 1NF and ensures that non-key attributes depend on the entire primary key. This is especially important when a table uses a composite primary key. Attributes that depend only on part of a composite key should be moved to another table.' },

      { type: 'heading', content: 'Third Normal Form (3NF)' },
      { type: 'text', content: 'Third Normal Form requires a table to satisfy 2NF and removes attributes that depend on other non-key attributes. In simple terms, non-key information should depend on the key, the whole key, and nothing but the key.' },

      { type: 'code', language: 'text', content: 'Poor Design:\n\nStudent ID | Student Name | Course ID | Course Name\n-----------|--------------|-----------|------------\n1          | John         | IT101     | Programming\n2          | Maria        | IT101     | Programming\n\nBetter Design:\n\nStudents\nStudent ID | Student Name\n-----------|-------------\n1          | John\n2          | Maria\n\nCourses\nCourse ID | Course Name\n----------|------------\nIT101     | Programming\n\nEnrollments\nStudent ID | Course ID\n-----------|----------\n1          | IT101\n2          | IT101' },

      { type: 'heading', content: 'Normalization and Data Redundancy' },
      { type: 'text', content: 'Data redundancy occurs when the same information is unnecessarily stored in multiple locations. Normalization reduces redundancy by separating related information into appropriate tables. This makes updates easier and helps prevent different copies of the same information from becoming inconsistent.' },

      { type: 'heading', content: 'Database Constraints' },
      { type: 'text', content: 'Constraints are rules applied to database columns to help maintain valid and consistent data. Common constraints include PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE, and CHECK.' },

      { type: 'code', language: 'sql', content: 'CREATE TABLE students (\n    student_id INT PRIMARY KEY,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE,\n    age INT CHECK (age >= 0),\n    course_id INT,\n    FOREIGN KEY (course_id)\n        REFERENCES courses(course_id)\n);' },

      { type: 'heading', content: 'Entity Relationship Diagrams (ERD)' },
      { type: 'text', content: 'An Entity Relationship Diagram (ERD) is a visual representation of entities, attributes, and relationships in a database. ERDs help database designers understand how tables should be organized before implementing the database.' },

      { type: 'code', language: 'text', content: 'CUSTOMERS\n-----------\ncustomer_id (PK)\nname\nemail\n      |\n      | 1\n      |\n      | many\n      v\nORDERS\n-----------\norder_id (PK)\ncustomer_id (FK)\norder_date' },

      { type: 'heading', content: 'When Should You Normalize?' },
      { type: 'text', content: 'Normalization is especially useful when data is frequently updated, when relationships between entities need to be represented clearly, and when duplicated information could cause inconsistencies. A normalized design can make data easier to maintain and protect its integrity.' },

      { type: 'heading', content: 'Denormalization' },
      { type: 'text', content: 'Denormalization is the intentional introduction of some redundant data into a database to improve specific read performance or simplify certain queries. It should be done carefully because excessive duplication can create consistency and maintenance problems.' },

      { type: 'heading', content: 'Why Database Design Matters' },
      { type: 'text', content: 'Good database design provides a strong foundation for reliable applications and efficient data management. Database administrators and developers need to understand how tables, keys, relationships, constraints, and normalization work together to maintain accurate and usable data.' },

      { type: 'tip', content: 'When designing a relational database, identify the entities first, define their attributes, choose appropriate primary keys, establish relationships using foreign keys, and normalize the data to reduce unnecessary duplication. Always consider the actual requirements of the application before finalizing the design.' },
    ],
  },
  {
    id: 'dataadmin-4',
    thumbnail: 'https://readdy.ai/api/search-image?query=Database%20administrator%20monitoring%20dashboard%20with%20server%20metrics%2C%20backups%20and%20security%20shields%2C%20database%20operations%20concept%2C%20minimal%20flat%20design%20aesthetic%2C%20soft%20cool%20neutral%20tones%2C%20clean%20light%20background&width=640&height=360&seq=dataadmin-4-thumb&orientation=landscape',
    title: 'Database Administration Fundamentals',
    category: 'database',
    categoryName: 'Database Administrator',
    description: 'Learn the fundamental responsibilities of database administrators, including database installation, configuration, user management, security, backups, monitoring, maintenance, and data availability.',
    difficulty: 2,
    estimatedMinutes: 55,
    orderIndex: 4,
    prerequisites: ['dataadmin-3'],
    xpReward: 100,
    icon: 'ri-settings-3-line',
    content: [
      { type: 'heading', content: 'What is Database Administration?' },
      { type: 'text', content: 'Database administration is the process of managing and maintaining databases so that they remain secure, available, reliable, and efficient. Database administrators, commonly called DBAs, are responsible for tasks such as configuring database systems, managing users, protecting data, performing backups, monitoring performance, and maintaining database availability.' },

      { type: 'heading', content: 'What Does a Database Administrator Do?' },
      { type: 'text', content: 'A database administrator performs a variety of technical and administrative tasks throughout the life of a database. The exact responsibilities depend on the organization and database platform, but the main goal is to keep databases operating correctly and ensure that data remains accessible and protected.' },

      { type: 'list', items: [
        'Install and configure database management systems',
        'Create and manage databases',
        'Manage database users and permissions',
        'Protect sensitive information',
        'Perform database backups and recovery',
        'Monitor database performance and availability',
        'Apply updates and security patches',
        'Troubleshoot database problems',
        'Maintain data integrity and reliability'
      ] },

      { type: 'heading', content: 'Database Management Systems' },
      { type: 'text', content: 'A Database Management System (DBMS) provides the software and services required to store, organize, retrieve, and manage data. Database administrators need to understand the specific DBMS used by their organization because administration commands, tools, security features, and configuration options can differ between database platforms.' },

      { type: 'list', items: [
        'MySQL',
        'PostgreSQL',
        'Microsoft SQL Server',
        'Oracle Database',
        'MariaDB'
      ] },

      { type: 'heading', content: 'Database Installation and Configuration' },
      { type: 'text', content: 'Before a database can be used, the DBMS must be installed and configured. Configuration may include setting storage locations, network access, authentication methods, memory usage, logging, and other database settings. Proper configuration helps ensure that the database operates securely and efficiently.' },

      { type: 'heading', content: 'Database Users and Accounts' },
      { type: 'text', content: 'Database systems use user accounts to identify people and applications that access the database. Administrators create, modify, disable, and remove accounts as needed. User accounts should follow the principle of least privilege, meaning users should receive only the permissions necessary to perform their tasks.' },

      { type: 'code', language: 'sql', content: '-- Example: create a database user\nCREATE USER app_user WITH PASSWORD \'strong_password\';\n\n-- Grant limited access\nGRANT SELECT, INSERT, UPDATE\nON students\nTO app_user;' },

      { type: 'tip', content: 'Avoid giving every database user administrative privileges. Use separate accounts and grant only the permissions required for each role or application.' },

      { type: 'heading', content: 'Database Roles and Permissions' },
      { type: 'text', content: 'Roles and permissions control what users are allowed to do within a database. Common privileges include SELECT, INSERT, UPDATE, DELETE, and permissions for creating or modifying database objects. Role-based access makes it easier to manage permissions consistently.' },

      { type: 'code', language: 'sql', content: '-- Create a role\nCREATE ROLE data_reader;\n\n-- Grant read access\nGRANT SELECT ON students TO data_reader;\n\n-- Assign the role to a user\nGRANT data_reader TO analyst;' },

      { type: 'heading', content: 'Database Security' },
      { type: 'text', content: 'Database security protects databases from unauthorized access, accidental changes, data loss, and other threats. Security measures include strong authentication, access controls, encryption, auditing, secure configurations, regular updates, and appropriate backup procedures.' },

      { type: 'list', items: [
        'Use strong authentication',
        'Apply least-privilege access',
        'Protect sensitive data',
        'Keep database software updated',
        'Monitor authentication and database activity',
        'Use encryption when appropriate',
        'Regularly review user permissions'
      ] },

      { type: 'heading', content: 'Database Backups' },
      { type: 'text', content: 'A database backup is a copy of database data that can be used to restore information after accidental deletion, hardware failure, software problems, security incidents, or other disruptions. A backup strategy should consider how frequently backups are performed, where they are stored, and how long they are retained.' },

      { type: 'code', language: 'text', content: 'Example Backup Strategy:\n\nDatabase\n   │\n   ├── Full Backup\n   │\n   ├── Incremental Backup\n   │\n   └── Transaction Logs\n          │\n          ↓\n     Backup Storage\n          │\n          ↓\n     Recovery Process' },

      { type: 'heading', content: 'Database Recovery' },
      { type: 'text', content: 'Database recovery is the process of restoring a database to a usable state after data loss or system failure. Administrators may restore backups and transaction information depending on the database system and recovery strategy. Recovery procedures should be tested regularly rather than assuming that backups will always work.' },

      { type: 'heading', content: 'High Availability' },
      { type: 'text', content: 'High availability means designing systems so that database services remain accessible with minimal interruption. Techniques such as replication, failover systems, clustering, and redundant infrastructure can reduce downtime when a component fails.' },

      { type: 'code', language: 'text', content: 'Primary Database\n       │\n       │ Replication\n       ↓\nSecondary Database\n       │\n       ↓\nFailover when necessary' },

      { type: 'heading', content: 'Database Monitoring' },
      { type: 'text', content: 'Database monitoring involves observing the health, performance, availability, and activity of a database system. Administrators monitor metrics such as CPU usage, memory usage, storage capacity, active connections, query performance, errors, and system availability.' },

      { type: 'list', items: [
        'CPU and memory utilization',
        'Disk and storage usage',
        'Database connections',
        'Slow or expensive queries',
        'Errors and warnings',
        'Transaction activity',
        'Database availability'
      ] },

      { type: 'heading', content: 'Database Logs' },
      { type: 'text', content: 'Database systems generate logs containing information about system events, errors, connections, queries, and other activities. Administrators can use logs to troubleshoot problems, investigate unusual activity, and understand what happened during a system failure.' },

      { type: 'code', language: 'text', content: 'Example Database Log:\n\n2026-09-12 10:15:21  Connection established\n2026-09-12 10:16:03  Query executed\n2026-09-12 10:18:44  Warning: high connection count\n2026-09-12 10:20:10  Backup completed successfully' },

      { type: 'heading', content: 'Database Maintenance' },
      { type: 'text', content: 'Database maintenance consists of routine tasks that keep a database reliable and efficient. Depending on the DBMS, maintenance can include updating software, managing storage, checking database integrity, maintaining indexes, reviewing logs, removing unnecessary data, and verifying backups.' },

      { type: 'heading', content: 'Database Updates and Patches' },
      { type: 'text', content: 'Database software should be kept up to date with appropriate security and maintenance releases. Administrators should test updates in a controlled environment when possible and plan maintenance procedures carefully to reduce the risk of unexpected downtime or compatibility problems.' },

      { type: 'heading', content: 'Data Integrity' },
      { type: 'text', content: 'Data integrity means maintaining accurate, consistent, and reliable information in a database. Database constraints, transactions, validation rules, access controls, backups, and proper database design all contribute to maintaining data integrity.' },

      { type: 'heading', content: 'Database Documentation' },
      { type: 'text', content: 'Documentation helps administrators understand and maintain database environments. Useful documentation can include database structures, user roles, backup procedures, recovery steps, configuration settings, maintenance schedules, and important operational procedures.' },

      { type: 'heading', content: 'Basic Database Administration Workflow' },
      { type: 'code', language: 'text', content: 'Plan Database\n      ↓\nInstall & Configure\n      ↓\nCreate Users & Permissions\n      ↓\nSecure Database\n      ↓\nBackup Data\n      ↓\nMonitor Database\n      ↓\nMaintain & Update\n      ↓\nTest Recovery\n      ↓\nReview & Improve' },

      { type: 'heading', content: 'Why Database Administration Matters' },
      { type: 'text', content: 'Organizations depend on databases to support applications and store important information. Effective database administration helps keep this information available, secure, accurate, and recoverable. Strong administration practices also reduce downtime and help organizations respond effectively when technical problems occur.' },

      { type: 'tip', content: 'A good database administrator focuses on security, availability, reliability, and performance. Always understand who needs access to the database, protect that access, maintain reliable backups, monitor the system, and regularly test recovery procedures.' },
    ],
  },
  {
    id: 'dataadmin-5',
    thumbnail: 'https://readdy.ai/api/search-image?query=Database%20security%20concept%20with%20keyhole%2C%20shield%20and%20encrypted%20data%20symbols%2C%20access%20control%20and%20encryption%20illustration%2C%20minimal%20flat%20design%20aesthetic%2C%20soft%20cool%20neutral%20tones%2C%20clean%20light%20background&width=640&height=360&seq=dataadmin-5-thumb&orientation=landscape',
    title: 'Database Security',
    category: 'database',
    categoryName: 'Database Administrator',
    description: 'Learn the fundamentals of database security, including authentication, authorization, access control, encryption, auditing, secure configuration, and common database security threats.',
    difficulty: 2,
    estimatedMinutes: 55,
    orderIndex: 5,
    prerequisites: ['dataadmin-4'],
    xpReward: 100,
    icon: 'ri-shield-keyhole-line',
    content: [
      { type: 'heading', content: 'What is Database Security?' },
      { type: 'text', content: 'Database security is the practice of protecting databases and the information they contain from unauthorized access, modification, disclosure, destruction, and other security threats. Database security combines access controls, authentication, encryption, monitoring, auditing, secure configuration, and regular maintenance.' },

      { type: 'heading', content: 'Why Database Security Matters' },
      { type: 'text', content: 'Databases often contain valuable information such as customer records, financial information, employee data, application credentials, and business information. A compromised database can result in data exposure, unauthorized changes, service disruption, financial loss, and damage to an organization.' },

      { type: 'list', items: [
        'Protect sensitive information from unauthorized access',
        'Prevent unauthorized modification or deletion of data',
        'Maintain data confidentiality and integrity',
        'Reduce the risk of data breaches',
        'Monitor and investigate suspicious database activity',
        'Maintain availability of database services'
      ] },

      { type: 'heading', content: 'Authentication' },
      { type: 'text', content: 'Authentication is the process of verifying the identity of a user or application attempting to access a database. Database systems can use usernames and passwords, certificates, operating system authentication, or other authentication mechanisms depending on the platform and configuration.' },

      { type: 'code', language: 'text', content: 'User/Application\n       │\n       ↓\n   Authentication\n       │\n   ┌───┴───┐\n   │       │\nValid     Invalid\n   │       │\n   ↓       ↓\nAccess   Denied' },

      { type: 'heading', content: 'Authorization' },
      { type: 'text', content: 'Authorization determines what an authenticated user or application is allowed to do. A user may be permitted to read specific tables but not modify or delete their contents. Separating authentication from authorization helps administrators control database access more precisely.' },

      { type: 'heading', content: 'Principle of Least Privilege' },
      { type: 'text', content: 'The principle of least privilege means giving users and applications only the permissions they need to perform their tasks. Limiting privileges reduces the potential impact of compromised accounts, accidental actions, and unauthorized activity.' },

      { type: 'code', language: 'sql', content: '-- Create a read-only role\nCREATE ROLE report_reader;\n\n-- Grant only SELECT permission\nGRANT SELECT ON students TO report_reader;\n\n-- Assign the role to a user\nGRANT report_reader TO analyst;' },

      { type: 'tip', content: 'Avoid using administrative accounts for normal application operations. Use separate accounts with limited permissions and grant only the privileges required for the task.' },

      { type: 'heading', content: 'Database Roles and Privileges' },
      { type: 'text', content: 'Roles provide a convenient way to organize and manage database permissions. Instead of assigning permissions individually to every user, administrators can create roles for groups such as administrators, developers, analysts, and read-only users.' },

      { type: 'list', items: [
        'SELECT — Read data',
        'INSERT — Add new records',
        'UPDATE — Modify existing records',
        'DELETE — Remove records',
        'CREATE — Create database objects',
        'ALTER — Modify database objects',
        'DROP — Remove database objects'
      ] },

      { type: 'heading', content: 'Protecting Database Credentials' },
      { type: 'text', content: 'Database credentials should be protected because compromised credentials can provide direct access to database systems. Passwords should not be stored in application source code or exposed in configuration files that are accessible to unauthorized users. Applications should use appropriate secrets-management mechanisms and secure authentication practices.' },

      { type: 'code', language: 'javascript', content: '// Avoid hard-coding database credentials\nconst password = "MyDatabasePassword123";\n\n// Prefer environment variables or a secure\n// secrets-management system\nconst password = process.env.DB_PASSWORD;' },

      { type: 'heading', content: 'Encryption' },
      { type: 'text', content: 'Encryption transforms information into a protected form that cannot be easily understood without the appropriate key. Database security can use encryption to protect data while it is being transmitted and, where appropriate, while it is stored.' },

      { type: 'list', items: [
        'Encryption in transit — Protects data as it travels between systems',
        'Encryption at rest — Protects stored data and database files',
        'Key management — Protects and controls the encryption keys'
      ] },

      { type: 'heading', content: 'SQL Injection' },
      { type: 'text', content: 'SQL injection is an application security vulnerability that can occur when untrusted input is improperly incorporated into SQL statements. Attackers may manipulate database queries to access, modify, or delete information. Applications should use parameterized queries or prepared statements instead of directly concatenating user input into SQL statements.' },

      { type: 'code', language: 'javascript', content: '// Vulnerable pattern — do not use\nconst query = "SELECT * FROM users WHERE email = \'" + userInput + "\'";\n\n// Safer approach using a parameterized query\nconst query = "SELECT * FROM users WHERE email = $1";\nconst result = await db.query(query, [userInput]);' },

      { type: 'tip', content: 'Database security is not only the responsibility of the database administrator. Applications that connect to databases must also validate input, use parameterized queries, protect credentials, and follow secure development practices.' },

      { type: 'heading', content: 'Database Auditing' },
      { type: 'text', content: 'Database auditing records important database activity so administrators can determine who performed an action, what action occurred, and when it occurred. Audit information can help with security investigations, compliance requirements, troubleshooting, and detecting suspicious behavior.' },

      { type: 'code', language: 'text', content: 'Example Audit Events:\n\nUser: analyst\nAction: SELECT\nObject: students\nTime: 2026-09-12 14:30:15\n\nUser: admin\nAction: UPDATE\nObject: students\nTime: 2026-09-12 14:35:42' },

      { type: 'heading', content: 'Monitoring Database Activity' },
      { type: 'text', content: 'Database monitoring helps administrators identify unusual activity and potential security problems. Monitoring can include failed login attempts, unusual queries, unexpected privilege changes, large data transfers, and other events that may indicate an attack or compromised account.' },

      { type: 'list', items: [
        'Failed authentication attempts',
        'Unexpected administrator activity',
        'Unusual database queries',
        'Unauthorized permission changes',
        'Unexpected data modifications',
        'Large or unusual data exports'
      ] },

      { type: 'heading', content: 'Secure Database Configuration' },
      { type: 'text', content: 'A secure database configuration reduces unnecessary exposure and limits opportunities for unauthorized access. Administrators should disable unnecessary services and accounts, restrict network access, use secure authentication methods, apply appropriate permissions, and keep the database software updated.' },

      { type: 'heading', content: 'Network Access Control' },
      { type: 'text', content: 'Database servers should not normally be exposed directly to the public internet unless there is a specific security requirement and appropriate protections are in place. Firewalls, network segmentation, private networks, and access control rules can limit which systems are allowed to connect to a database.' },

      { type: 'code', language: 'text', content: 'Internet\n    │\n    ↓\nFirewall\n    │\n    ↓\nApplication Server\n    │\n    ↓\nDatabase Server\n\nOnly authorized systems should\nbe allowed to access the database.' },

      { type: 'heading', content: 'Database Security Updates' },
      { type: 'text', content: 'Database software can contain vulnerabilities that may be addressed through security updates and patches. Administrators should monitor relevant security advisories, test updates appropriately, and maintain supported database versions to reduce exposure to known vulnerabilities.' },

      { type: 'heading', content: 'Backup Security' },
      { type: 'text', content: 'Backups contain copies of database information and therefore require the same level of protection as production data. Backups should be protected against unauthorized access, accidental deletion, and other threats. Organizations should also test restoration procedures regularly.' },

      { type: 'heading', content: 'Database Security Best Practices' },
      { type: 'list', items: [
        'Use strong authentication mechanisms',
        'Apply the principle of least privilege',
        'Use roles to manage permissions',
        'Encrypt sensitive data when appropriate',
        'Use parameterized queries to prevent SQL injection',
        'Protect database credentials and secrets',
        'Monitor and audit database activity',
        'Restrict network access to database servers',
        'Keep database software updated',
        'Secure and regularly test database backups'
      ] },

      { type: 'heading', content: 'Database Security Defense Model' },
      { type: 'code', language: 'text', content: '              DATABASE SECURITY\n                      │\n       ┌──────────────┼──────────────┐\n       ↓              ↓              ↓\n Authentication   Authorization   Encryption\n       │              │              │\n       └──────────────┼──────────────┘\n                      ↓\n               Monitoring & Audit\n                      ↓\n               Backup & Recovery\n                      ↓\n                Secure Database' },

      { type: 'heading', content: 'Why Database Security Matters to Data Administrators' },
      { type: 'text', content: 'Database administrators play an important role in protecting organizational data. They manage access, configure security controls, monitor activity, maintain database software, protect backups, and help ensure that databases remain secure and available. Effective database security requires both technical controls and responsible administration.' },

      { type: 'tip', content: 'Think of database security as multiple layers of protection. Strong authentication, least-privilege access, secure applications, encryption, monitoring, updates, and protected backups work together to reduce the risk of data compromise.' },
    ],
  },
  {
    id: 'dataadmin-6',
    thumbnail: 'https://readdy.ai/api/search-image?query=Database%20backup%20and%20recovery%20concept%20with%20hard%20drive%2C%20archive%20boxes%20and%20restore%20arrows%2C%20data%20protection%20illustration%2C%20minimal%20flat%20design%20aesthetic%2C%20soft%20cool%20neutral%20tones%2C%20clean%20light%20background&width=640&height=360&seq=dataadmin-6-thumb&orientation=landscape',
    title: 'Backup & Recovery',
    category: 'database',
    categoryName: 'Database Administrator',
    description: 'Learn the fundamentals of database backup and recovery, including backup types, recovery strategies, restore procedures, point-in-time recovery, backup security, and disaster recovery planning.',
    difficulty: 2,
    estimatedMinutes: 55,
    orderIndex: 6,
    prerequisites: ['dataadmin-5'],
    xpReward: 100,
    icon: 'ri-hard-drive-3-line',
    content: [
        { type: 'heading', content: 'What is Database Backup?' },
        { type: 'text', content: 'A database backup is a copy of database information that can be used to restore data when the original database is lost, damaged, corrupted, accidentally modified, or unavailable. Backups are an essential part of database administration because they provide a way to recover information after unexpected incidents.' },

        { type: 'heading', content: 'Why Database Backups Are Important' },
        { type: 'text', content: 'Databases can be affected by hardware failures, software problems, human mistakes, security incidents, accidental deletion, or natural disasters. A reliable backup strategy allows administrators to restore data and reduce the impact of these events.' },

        { type: 'list', items: [
            'Recover accidentally deleted data',
            'Restore databases after hardware or software failures',
            'Recover from data corruption',
            'Support recovery after security incidents',
            'Reduce downtime and data loss',
            'Support disaster recovery operations'
        ] },

        { type: 'heading', content: 'Full Backup' },
        { type: 'text', content: 'A full backup contains a complete copy of the selected database or data set. Full backups provide a simple starting point for recovery, but they can require more storage space and take longer to create than other backup types.' },

        { type: 'code', language: 'text', content: 'Full Backup\n\nDatabase\n   │\n   ├── Table A\n   ├── Table B\n   ├── Table C\n   └── Table D\n          │\n          ↓\n    Complete Backup' },

        { type: 'heading', content: 'Incremental Backup' },
        { type: 'text', content: 'An incremental backup stores data that has changed since a previous backup. Because it contains only changes, incremental backups can require less storage and complete faster than full backups. Recovery may require the appropriate full backup and subsequent incremental backups.' },

        { type: 'code', language: 'text', content: 'Monday\nFull Backup\n    ↓\nTuesday\nChanges → Incremental Backup\n    ↓\nWednesday\nChanges → Incremental Backup\n    ↓\nThursday\nChanges → Incremental Backup' },

        { type: 'heading', content: 'Differential Backup' },
        { type: 'text', content: 'A differential backup stores changes made since the most recent full backup. As more changes occur, the differential backup can become larger. During recovery, a full backup and the appropriate differential backup are typically needed.' },

        { type: 'code', language: 'text', content: 'Monday\nFull Backup\n    │\n    ├── Tuesday Changes\n    ├── Wednesday Changes\n    └── Thursday Changes\n              │\n              ↓\n       Differential Backup' },

        { type: 'heading', content: 'Transaction Logs' },
        { type: 'text', content: 'Transaction logs record changes made to a database. Depending on the database system and recovery model, transaction log information can be used to help restore database changes and recover the database to an appropriate point in time.' },

        { type: 'code', language: 'text', content: 'Database\n    │\n    ├── Transaction 1\n    ├── Transaction 2\n    ├── Transaction 3\n    └── Transaction 4\n             │\n             ↓\n       Transaction Log' },

        { type: 'heading', content: 'Recovery' },
        { type: 'text', content: 'Database recovery is the process of returning a database to a usable and consistent state after a failure or data-loss event. Recovery can involve restoring backup files, applying transaction information, and verifying that the database is functioning correctly.' },

        { type: 'heading', content: 'Restore Process' },
        { type: 'text', content: 'A restore operation uses one or more backups to recreate a database. The exact process depends on the database platform and backup strategy. Administrators should document restore procedures and test them regularly so that recovery can be performed effectively during an actual incident.' },

        { type: 'code', language: 'text', content: 'Database Failure\n       ↓\nIdentify Recovery Point\n       ↓\nLocate Valid Backup\n       ↓\nRestore Full Backup\n       ↓\nApply Additional Backups\n       ↓\nApply Transaction Information\n       ↓\nVerify Database\n       ↓\nReturn to Service' },

        { type: 'heading', content: 'Point-in-Time Recovery' },
        { type: 'text', content: 'Point-in-time recovery allows a database to be restored to a specific point in time when the required backup and transaction information are available. This can be useful when an unwanted change or accidental deletion occurs and the administrator needs to recover the database to a time before the event.' },

        { type: 'code', language: 'text', content: '10:00 AM ─ Normal Operation\n10:30 AM ─ Important Data Added\n11:00 AM ─ Accidental Data Deletion\n11:15 AM ─ Problem Discovered\n\nRecovery Target:\n10:59 AM\n\nRestore database to a point before\n the accidental deletion.' },

        { type: 'heading', content: 'Recovery Point Objective (RPO)' },
        { type: 'text', content: 'Recovery Point Objective (RPO) defines how much data loss an organization can tolerate after an incident. For example, an RPO of one hour means the organization is planning its recovery strategy around losing no more than approximately one hour of data in a worst-case recovery scenario.' },

        { type: 'heading', content: 'Recovery Time Objective (RTO)' },
        { type: 'text', content: 'Recovery Time Objective (RTO) defines the target amount of time within which a system or database should be restored after an outage. RTO helps organizations determine how quickly recovery procedures and infrastructure need to operate.' },

        { type: 'code', language: 'text', content: 'RPO = How much data can we afford to lose?\n\nRTO = How quickly must the system be restored?' },

        { type: 'heading', content: 'Backup Storage' },
        { type: 'text', content: 'Backups should be stored in locations that provide appropriate protection against data loss. Organizations may use local storage, separate servers, remote storage, or cloud-based storage. Important backups should not depend entirely on the same system that they are intended to protect.' },

        { type: 'heading', content: 'The 3-2-1 Backup Strategy' },
        { type: 'text', content: 'The 3-2-1 backup strategy is a commonly recommended approach for improving backup resilience. It involves maintaining at least three copies of important data, storing the copies on at least two different types of storage or media, and keeping at least one copy in a separate or off-site location.' },

        { type: 'code', language: 'text', content: '3 Copies of Data\n       │\n       ├── Production Database\n       ├── Local Backup\n       └── Off-site Backup\n\n2 Different Storage Locations/Types\n\n1 Copy Kept Off-site' },

        { type: 'heading', content: 'Backup Security' },
        { type: 'text', content: 'Backups can contain the same sensitive information as production databases, so they must also be protected. Access controls, encryption, secure storage, appropriate retention policies, and monitoring should be used to reduce the risk of unauthorized access or loss.' },

        { type: 'list', items: [
            'Restrict access to backup files',
            'Encrypt sensitive backups when appropriate',
            'Protect backup credentials',
            'Use secure backup storage',
            'Monitor backup activity',
            'Establish appropriate retention policies'
        ] },

        { type: 'heading', content: 'Testing Backups' },
        { type: 'text', content: 'A backup is only useful if it can be successfully restored. Administrators should regularly test backup restoration procedures to verify that backup files are complete, accessible, and usable. Testing also helps identify problems before an actual recovery situation occurs.' },

        { type: 'tip', content: 'Do not assume that a successful backup job automatically means that recovery will work. Regularly perform controlled restore tests and document the results.' },

        { type: 'heading', content: 'Backup Retention' },
        { type: 'text', content: 'Backup retention determines how long backup copies are kept. Retention policies should consider business requirements, storage capacity, legal or regulatory requirements, and the organization’s recovery needs. Older backups may be removed according to the approved retention policy.' },

        { type: 'heading', content: 'Disaster Recovery' },
        { type: 'text', content: 'Disaster recovery is the process of preparing systems and procedures for restoring technology services after a major disruption. Database recovery is one part of a larger disaster recovery plan, which may also include alternate infrastructure, communication procedures, application recovery, and business continuity planning.' },

        { type: 'code', language: 'text', content: 'Disaster Occurs\n       ↓\nAssess Impact\n       ↓\nActivate Recovery Plan\n       ↓\nRestore Infrastructure\n       ↓\nRestore Database\n       ↓\nRestore Applications\n       ↓\nVerify Services\n       ↓\nReturn to Normal Operations' },

        { type: 'heading', content: 'Backup and Recovery Best Practices' },
        { type: 'list', items: [
            'Create regular and reliable backups',
            'Choose backup types based on recovery requirements',
            'Keep backups separate from production systems',
            'Protect backups with appropriate access controls',
            'Encrypt sensitive backup data when appropriate',
            'Define RPO and RTO requirements',
            'Regularly test restoration procedures',
            'Document backup and recovery procedures',
            'Monitor backup jobs for failures',
            'Review and update the recovery plan regularly'
        ] },

        { type: 'heading', content: 'Why Backup and Recovery Matters to Data Administrators' },
        { type: 'text', content: 'Database administrators are responsible for helping ensure that important data can be recovered when problems occur. Effective backup and recovery practices reduce the risk of permanent data loss and help organizations restore database services after failures, mistakes, and other disruptive events.' },

        { type: 'tip', content: 'Think about backup and recovery as a complete cycle: create backups, protect them, monitor them, test restoration, document the process, and regularly review whether the strategy still meets the organization’s recovery requirements.' },
    ],
  },
  {
    id: 'dataadmin-7',
    thumbnail: 'https://readdy.ai/api/search-image?query=Database%20performance%20optimization%20concept%20with%20speed%20gauge%2C%20query%20execution%20plan%20and%20index%20icons%2C%20tuning%20illustration%2C%20minimal%20flat%20design%20aesthetic%2C%20soft%20cool%20neutral%20tones%2C%20clean%20light%20background&width=640&height=360&seq=dataadmin-7-thumb&orientation=landscape',
    title: 'Database Performance & Optimization',
    category: 'database',
    categoryName: 'Database Administrator',
    description: 'Learn how to monitor and improve database performance using indexes, query optimization, execution plans, resource management, and performance monitoring techniques.',
    difficulty: 3,
    estimatedMinutes: 60,
    orderIndex: 7,
    prerequisites: ['dataadmin-6'],
    xpReward: 110,
    icon: 'ri-speed-up-line',
    content: [
        { type: 'heading', content: 'What is Database Performance?' },
        { type: 'text', content: 'Database performance refers to how efficiently a database processes queries, transactions, and other operations. A well-performing database can respond to requests quickly while using system resources efficiently. Database administrators monitor performance to identify slow queries, resource bottlenecks, and configuration problems.' },

        { type: 'heading', content: 'Why Database Performance Matters' },
        { type: 'text', content: 'Poor database performance can cause slow applications, increased resource usage, timeouts, and poor user experiences. As the amount of data and number of users increase, database administrators need to identify and resolve performance problems before they significantly affect applications and services.' },

        { type: 'list', items: [
            'Faster query response times',
            'Better application performance',
            'More efficient use of CPU and memory',
            'Reduced database resource consumption',
            'Improved scalability',
            'Better system reliability'
        ] },

        { type: 'heading', content: 'Common Causes of Poor Database Performance' },
        { type: 'text', content: 'Database performance problems can have many causes. Common examples include inefficient queries, missing or inappropriate indexes, excessive data processing, insufficient system resources, blocking, poorly designed database structures, and improper configuration.' },

        { type: 'list', items: [
            'Slow or inefficient SQL queries',
            'Missing indexes',
            'Poorly designed indexes',
            'Large amounts of unnecessary data processing',
            'Insufficient CPU or memory',
            'Storage performance limitations',
            'Blocking and locking',
            'Poor database configuration'
        ] },

        { type: 'heading', content: 'Understanding Database Queries' },
        { type: 'text', content: 'A database query requests information or performs an operation on stored data. The database management system determines how to execute the query. A simple query may be processed quickly, while a poorly designed query operating on a large table can require significant resources.' },

        { type: 'code', language: 'sql', content: '-- Retrieve students from a specific course\nSELECT student_id, name, email\nFROM students\nWHERE course = \'Information Technology\';' },

        { type: 'heading', content: 'Indexes' },
        { type: 'text', content: 'An index is a database structure that can help the database locate records more efficiently. Indexes can significantly improve the performance of certain queries, especially when searching or filtering large tables. However, indexes also require storage and can increase the cost of INSERT, UPDATE, and DELETE operations.' },

        { type: 'code', language: 'sql', content: '-- Create an index on the email column\nCREATE INDEX idx_students_email\nON students(email);\n\n-- Query that may benefit from the index\nSELECT *\nFROM students\nWHERE email = \'john@example.com\';' },

        { type: 'tip', content: 'Indexes can improve read performance, but creating indexes on every column is not a good strategy. Indexes should be selected based on actual query patterns and workload requirements.' },

        { type: 'heading', content: 'Choosing Columns for Indexes' },
        { type: 'text', content: 'Columns frequently used in WHERE conditions, JOIN operations, sorting, or other performance-sensitive queries may be good candidates for indexes. The appropriate choice depends on the database workload, data distribution, and query patterns.' },

        { type: 'list', items: [
            'Columns frequently used in WHERE conditions',
            'Columns commonly used to join tables',
            'Columns frequently used for sorting',
            'Columns used in important search operations',
            'Columns involved in frequently executed queries'
        ] },

        { type: 'heading', content: 'Query Optimization' },
        { type: 'text', content: 'Query optimization is the process of improving SQL queries so they can execute more efficiently. Optimization may involve selecting only required columns, filtering data appropriately, improving joins, using suitable indexes, and avoiding unnecessary operations.' },

        { type: 'code', language: 'sql', content: '-- Less efficient when only two columns are needed\nSELECT *\nFROM students\nWHERE course = \'IT\';\n\n-- More focused query\nSELECT student_id, name\nFROM students\nWHERE course = \'IT\';' },

        { type: 'heading', content: 'Using WHERE Efficiently' },
        { type: 'text', content: 'Filtering data as early as practical can reduce the amount of information that the database needs to process. Appropriate filtering can be particularly important when working with large tables.' },

        { type: 'code', language: 'sql', content: '-- Filter records using a specific condition\nSELECT student_id, name\nFROM students\nWHERE age >= 18\n  AND course = \'IT\';' },

        { type: 'heading', content: 'Execution Plans' },
        { type: 'text', content: 'An execution plan describes how a database management system intends to execute a query. Database administrators can examine execution plans to understand whether the database is using indexes, scanning tables, joining data efficiently, or performing expensive operations.' },

        { type: 'code', language: 'sql', content: '-- PostgreSQL example\nEXPLAIN\nSELECT *\nFROM students\nWHERE email = \'john@example.com\';\n\n-- PostgreSQL example with execution statistics\nEXPLAIN ANALYZE\nSELECT *\nFROM students\nWHERE email = \'john@example.com\';' },

        { type: 'heading', content: 'Table Scans' },
        { type: 'text', content: 'A table scan occurs when the database examines rows in a table to find records that satisfy a query. For some queries, a table scan is appropriate. However, scanning very large tables unnecessarily can increase query execution time and resource usage.' },

        { type: 'code', language: 'text', content: 'Query\n  │\n  ↓\nDatabase Optimizer\n  │\n  ├── Index Scan\n  │       ↓\n  │   Matching Rows\n  │\n  └── Table Scan\n          ↓\n      Many Rows Checked' },

        { type: 'heading', content: 'Joins and Performance' },
        { type: 'text', content: 'JOIN operations combine information from multiple tables. Joins are essential in relational databases, but inefficient joins can become expensive when tables contain large amounts of data. Appropriate indexes, join conditions, and query design can help improve join performance.' },

        { type: 'code', language: 'sql', content: 'SELECT students.name, courses.course_name\nFROM students\nINNER JOIN courses\nON students.course_id = courses.course_id\nWHERE courses.course_name = \'Database Systems\';' },

        { type: 'heading', content: 'Database Statistics' },
        { type: 'text', content: 'Database systems maintain statistics about data distribution and table contents. Query optimizers can use these statistics when selecting execution strategies. Keeping statistics accurate helps the database optimizer make better decisions.' },

        { type: 'heading', content: 'CPU, Memory, and Storage' },
        { type: 'text', content: 'Database performance depends not only on SQL queries but also on the resources available to the database server. CPU, memory, storage performance, and network capacity can all affect database operations. Administrators monitor these resources to identify bottlenecks.' },

        { type: 'list', items: [
            'CPU — Handles database processing and calculations',
            'Memory — Stores frequently accessed data and supports database operations',
            'Storage — Stores database files, indexes, and logs',
            'Network — Carries requests and database responses between systems'
        ] },

        { type: 'heading', content: 'Performance Monitoring' },
        { type: 'text', content: 'Performance monitoring involves continuously observing database activity and system resources. Administrators can use monitoring tools and database metrics to identify unusual behavior and performance degradation.' },

        { type: 'list', items: [
            'Query execution time',
            'CPU utilization',
            'Memory utilization',
            'Disk and storage activity',
            'Active database connections',
            'Transaction rates',
            'Locking and blocking',
            'Error rates'
        ] },

        { type: 'heading', content: 'Slow Queries' },
        { type: 'text', content: 'Slow queries are SQL statements that take longer than expected to complete. Administrators can identify slow queries through database monitoring, logs, performance tools, or query statistics. Once identified, queries can be analyzed and optimized based on the actual cause of the problem.' },

        { type: 'code', language: 'text', content: 'Slow Query Detected\n        ↓\nExamine Query\n        ↓\nCheck Execution Plan\n        ↓\nCheck Indexes\n        ↓\nCheck Data Volume\n        ↓\nOptimize Query\n        ↓\nTest Performance\n        ↓\nMonitor Again' },

        { type: 'heading', content: 'Locking and Blocking' },
        { type: 'text', content: 'Databases use locks to coordinate access to data when multiple transactions operate at the same time. Blocking can occur when one transaction holds a lock that another transaction needs. Excessive blocking can cause applications to wait and may negatively affect database performance.' },

        { type: 'heading', content: 'Transactions and Performance' },
        { type: 'text', content: 'A transaction is a group of database operations treated as a unit of work. Transactions help maintain data consistency, but transactions that remain open for too long can hold resources and locks unnecessarily. Administrators should monitor transaction behavior when investigating performance issues.' },

        { type: 'code', language: 'sql', content: 'BEGIN;\n\nUPDATE accounts\nSET balance = balance - 100\nWHERE account_id = 1;\n\nUPDATE accounts\nSET balance = balance + 100\nWHERE account_id = 2;\n\nCOMMIT;' },

        { type: 'heading', content: 'Database Maintenance and Performance' },
        { type: 'text', content: 'Regular database maintenance can help maintain performance. Depending on the database platform, maintenance activities may include updating statistics, managing indexes, removing unnecessary data, checking database health, and reviewing configuration settings.' },

        { type: 'heading', content: 'Performance Optimization Workflow' },
        { type: 'code', language: 'text', content: 'Identify Problem\n      ↓\nCollect Performance Data\n      ↓\nAnalyze Queries & Resources\n      ↓\nFind Bottleneck\n      ↓\nApply Optimization\n      ↓\nTest Changes\n      ↓\nCompare Results\n      ↓\nMonitor Continuously' },

        { type: 'heading', content: 'Database Performance Best Practices' },
        { type: 'list', items: [
            'Monitor database performance regularly',
            'Identify and optimize frequently executed slow queries',
            'Use indexes appropriately',
            'Avoid unnecessary SELECT * queries',
            'Use efficient filtering and JOIN conditions',
            'Review execution plans for important queries',
            'Monitor CPU, memory, storage, and network resources',
            'Keep database statistics and maintenance tasks up to date',
            'Monitor locking and blocking',
            'Test performance changes before applying them to production systems'
        ] },

        { type: 'heading', content: 'Why Performance Optimization Matters to Data Administrators' },
        { type: 'text', content: 'Database administrators need to ensure that databases can handle their expected workload efficiently. Performance optimization helps applications respond faster, reduces unnecessary resource consumption, improves scalability, and helps prevent performance problems from affecting users and business operations.' },

        { type: 'tip', content: 'Do not optimize based only on assumptions. Measure the database first, identify the actual bottleneck, make one controlled change at a time, and compare performance before and after the change.' },
    ],
  },
  {
    id: 'dataadmin-8',
    thumbnail: 'https://readdy.ai/api/search-image?query=Database%20monitoring%20dashboard%20with%20live%20line%20charts%2C%20server%20health%20metrics%20and%20alert%20icons%2C%20observability%20illustration%2C%20minimal%20flat%20design%20aesthetic%2C%20soft%20cool%20neutral%20tones%2C%20clean%20light%20background&width=640&height=360&seq=dataadmin-8-thumb&orientation=landscape',
    title: 'Database Monitoring',
    category: 'database',
    categoryName: 'Database Administrator',
    description: 'Learn how to monitor database health, performance, availability, resource usage, queries, connections, logs, and alerts to identify and prevent database problems.',
    difficulty: 3,
    estimatedMinutes: 55,
    orderIndex: 8,
    prerequisites: ['dataadmin-7'],
    xpReward: 110,
    icon: 'ri-line-chart-line',
    content: [
        { type: 'heading', content: 'What is Database Monitoring?' },
        { type: 'text', content: 'Database monitoring is the process of continuously observing a database system to understand its health, performance, availability, and resource usage. Database administrators use monitoring tools, metrics, logs, and alerts to identify problems before they significantly affect applications and users.' },

        { type: 'heading', content: 'Why Database Monitoring Matters' },
        { type: 'text', content: 'Databases are critical components of many applications and business systems. Monitoring helps administrators detect performance degradation, connection problems, storage limitations, failed operations, unusual activity, and other issues. Early detection allows administrators to investigate and resolve problems before they cause major downtime or data-related incidents.' },

        { type: 'list', items: [
            'Detect database performance problems',
            'Monitor database availability',
            'Identify resource bottlenecks',
            'Find slow or expensive queries',
            'Monitor active connections',
            'Detect errors and unusual activity',
            'Track storage capacity',
            'Identify problems before they affect users'
        ] },

        { type: 'heading', content: 'Database Health' },
        { type: 'text', content: 'Database health describes the overall condition of a database system. A healthy database should be available, responsive, properly configured, and able to handle its expected workload. Administrators monitor several indicators to determine whether the database is operating normally.' },

        { type: 'list', items: [
            'Database availability',
            'Query response time',
            'CPU utilization',
            'Memory utilization',
            'Storage usage',
            'Active connections',
            'Transaction activity',
            'Errors and warnings',
            'Locking and blocking'
        ] },

        { type: 'heading', content: 'Important Database Metrics' },
        { type: 'text', content: 'Database metrics are measurements that help administrators understand how a database is performing. Monitoring these metrics over time makes it easier to recognize abnormal behavior and performance trends.' },

        { type: 'list', items: [
            'Latency — How long database operations take to complete',
            'Throughput — The amount of database work completed over a period of time',
            'CPU Usage — The amount of processor resources being consumed',
            'Memory Usage — The amount of available memory being used',
            'Connections — The number of active or open database connections',
            'Storage Usage — The amount of disk space consumed by database files',
            'Transaction Rate — The rate at which transactions are being processed',
            'Error Rate — The frequency of database errors or failed operations'
        ] },

        { type: 'heading', content: 'Monitoring CPU Usage' },
        { type: 'text', content: 'High CPU utilization can indicate that the database server is processing a heavy workload or that one or more queries are inefficient. CPU usage should be analyzed together with query activity and other system metrics rather than treated as a problem by itself.' },

        { type: 'code', language: 'text', content: 'CPU Monitoring Example:\n\nCPU Usage: 92%\nActive Queries: 145\nSlow Queries: 27\n\nPossible Investigation:\n        ↓\nCheck expensive queries\n        ↓\nReview execution plans\n        ↓\nCheck indexes\n        ↓\nCheck workload\n        ↓\nApply appropriate optimization' },

        { type: 'heading', content: 'Monitoring Memory Usage' },
        { type: 'text', content: 'Database systems use memory to cache data, process queries, manage connections, and perform other operations. Insufficient memory can cause increased disk activity and slower database operations. Administrators should monitor memory usage and investigate sustained memory pressure.' },

        { type: 'heading', content: 'Monitoring Storage' },
        { type: 'text', content: 'Database files, indexes, transaction logs, temporary files, and backups can consume significant storage space. Running out of disk space can prevent database operations from completing successfully and may cause serious service problems. Administrators should monitor storage capacity and plan for future growth.' },

        { type: 'code', language: 'text', content: 'Storage Monitoring:\n\nDatabase Size: 450 GB\nAvailable Space: 50 GB\nUsage: 90%\n\nWarning Threshold: 80%\nCritical Threshold: 95%\n\nAction:\nReview database growth\n        ↓\nRemove unnecessary data when appropriate\n        ↓\nIncrease storage capacity if required' },

        { type: 'heading', content: 'Monitoring Database Connections' },
        { type: 'text', content: 'Database connections allow applications and users to communicate with the database server. Too many simultaneous connections can consume resources and may prevent new clients from connecting. Administrators monitor connection counts and investigate unusual increases.' },

        { type: 'code', language: 'sql', content: '-- PostgreSQL example\nSELECT count(*) AS active_connections\nFROM pg_stat_activity;' },

        { type: 'heading', content: 'Monitoring Slow Queries' },
        { type: 'text', content: 'Slow queries can consume CPU, memory, storage, and other database resources. Monitoring slow queries allows administrators to identify statements that may need optimization. Important queries should be examined using execution plans and actual workload information.' },

        { type: 'code', language: 'sql', content: '-- PostgreSQL example\nSELECT query,\n       calls,\n       total_exec_time,\n       mean_exec_time\nFROM pg_stat_statements\nORDER BY total_exec_time DESC\nLIMIT 10;' },

        { type: 'tip', content: 'Do not assume that the longest query is always the main problem. Consider execution time, frequency, resource consumption, and the impact of the query on the overall workload.' },

        { type: 'heading', content: 'Monitoring Locks and Blocking' },
        { type: 'text', content: 'Database systems use locks to coordinate concurrent operations. Blocking occurs when one transaction prevents another transaction from accessing a resource it needs. Excessive blocking can increase query response times and make applications appear slow.' },

        { type: 'code', language: 'text', content: 'Transaction A\n     │\n     │ Holds Lock\n     ↓\nDatabase Resource\n     ↑\n     │ Waiting for Lock\nTransaction B\n\nResult: Blocking' },

        { type: 'heading', content: 'Deadlocks' },
        { type: 'text', content: 'A deadlock occurs when two or more transactions wait for resources held by each other. Because none of the transactions can continue, the database management system may detect the deadlock and terminate one transaction so the others can proceed.' },

        { type: 'code', language: 'text', content: 'Transaction A\n    │\n    ├── Locks Resource 1\n    │\n    └── Waits for Resource 2\n                  ↑\n                  │\nTransaction B     │\n    │             │\n    ├── Locks Resource 2\n    │\n    └── Waits for Resource 1\n\nResult: DEADLOCK' },

        { type: 'heading', content: 'Database Logs' },
        { type: 'text', content: 'Database logs record important events generated by the database system. Depending on the DBMS configuration, logs can contain errors, warnings, connection events, administrative operations, and other information useful for troubleshooting.' },

        { type: 'list', items: [
            'Errors',
            'Warnings',
            'Connection events',
            'Authentication events',
            'Database startup and shutdown events',
            'Backup and recovery events',
            'Administrative operations'
        ] },

        { type: 'heading', content: 'Alerts and Thresholds' },
        { type: 'text', content: 'Alerts notify administrators when monitored values reach conditions that may require attention. Administrators can establish thresholds for metrics such as CPU usage, storage capacity, query latency, connection counts, or error rates.' },

        { type: 'code', language: 'text', content: 'Metric\n  │\n  ↓\nCompare with Threshold\n  │\n  ├── Normal → Continue Monitoring\n  │\n  └── Threshold Exceeded\n             ↓\n          Alert\n             ↓\n       Administrator\n             ↓\n       Investigation' },

        { type: 'heading', content: 'Database Availability Monitoring' },
        { type: 'text', content: 'Availability monitoring checks whether database services are accessible and responding as expected. Monitoring can detect database outages, failed connections, service interruptions, and other availability problems.' },

        { type: 'heading', content: 'Backup Monitoring' },
        { type: 'text', content: 'Database administrators should monitor backup operations rather than assuming that backups are always successful. Monitoring can verify whether backups completed, whether they failed, how long they took, and whether backup storage is available.' },

        { type: 'list', items: [
            'Backup success or failure',
            'Backup completion time',
            'Backup size',
            'Backup storage capacity',
            'Backup retention',
            'Restore test results'
        ] },

        { type: 'heading', content: 'Monitoring Database Growth' },
        { type: 'text', content: 'Database growth monitoring tracks how quickly tables, indexes, logs, and other database objects consume storage. Understanding growth patterns helps administrators plan storage capacity and prevent unexpected storage shortages.' },

        { type: 'code', language: 'text', content: 'Database Growth\n      ↓\nCollect Size Information\n      ↓\nCompare Historical Data\n      ↓\nIdentify Growth Trend\n      ↓\nEstimate Future Capacity\n      ↓\nPlan Storage' },

        { type: 'heading', content: 'Monitoring Tools' },
        { type: 'text', content: 'Database administrators can use built-in database views, operating system tools, logs, command-line utilities, and dedicated monitoring platforms. The exact tools depend on the database management system being used.' },

        { type: 'list', items: [
            'PostgreSQL statistics views and monitoring tools',
            'MySQL Performance Schema and monitoring commands',
            'SQL Server monitoring tools and Dynamic Management Views',
            'Oracle Database monitoring and performance tools',
            'Operating system monitoring tools',
            'Centralized monitoring platforms'
        ] },

        { type: 'heading', content: 'Database Monitoring Workflow' },
        { type: 'code', language: 'text', content: 'Collect Metrics\n      ↓\nMonitor Database Activity\n      ↓\nDetect Abnormal Behavior\n      ↓\nGenerate Alert\n      ↓\nInvestigate Problem\n      ↓\nIdentify Root Cause\n      ↓\nApply Corrective Action\n      ↓\nVerify the Result\n      ↓\nContinue Monitoring' },

        { type: 'heading', content: 'Troubleshooting Using Monitoring Data' },
        { type: 'text', content: 'Monitoring data provides evidence that can help administrators troubleshoot database problems. Instead of changing multiple settings immediately, administrators should examine metrics, logs, queries, and system behavior to determine the most likely root cause.' },

        { type: 'list', items: [
            'Identify when the problem started',
            'Check database availability',
            'Review CPU and memory usage',
            'Check storage capacity',
            'Review active connections',
            'Identify slow queries',
            'Check locks and blocking',
            'Review database logs',
            'Compare current metrics with normal behavior',
            'Apply and test an appropriate solution'
        ] },

        { type: 'heading', content: 'Example Monitoring Scenario' },
        { type: 'text', content: 'Suppose users report that an application has become slow. The administrator checks the monitoring dashboard and discovers that CPU usage has increased significantly while several queries are taking much longer than normal. The administrator can then examine the slow queries, review their execution plans, check indexes and workload changes, and test an appropriate optimization.' },

        { type: 'code', language: 'text', content: 'Users Report Slow Application\n            ↓\nCheck Database Metrics\n            ↓\nCPU Usage High\n            ↓\nFind Expensive Queries\n            ↓\nReview Execution Plans\n            ↓\nCheck Indexes & Data Changes\n            ↓\nOptimize Problem\n            ↓\nTest Improvement\n            ↓\nMonitor Again' },

        { type: 'heading', content: 'Database Monitoring Best Practices' },
        { type: 'list', items: [
            'Monitor database availability continuously',
            'Track important performance metrics',
            'Set meaningful alert thresholds',
            'Monitor storage capacity and database growth',
            'Track slow and resource-intensive queries',
            'Monitor connections, locks, and blocking',
            'Review database logs regularly',
            'Monitor backup operations',
            'Keep historical monitoring data when appropriate',
            'Investigate abnormal behavior before making major changes',
            'Test corrective actions before applying risky changes to production'
        ] },

        { type: 'heading', content: 'Why Database Monitoring Matters to Data Administrators' },
        { type: 'text', content: 'Database monitoring gives administrators visibility into the behavior and health of database systems. By continuously collecting and analyzing useful information, administrators can detect problems earlier, troubleshoot more effectively, plan capacity, maintain availability, and improve database performance.' },

        { type: 'tip', content: 'Good database monitoring is proactive rather than reactive. Do not wait for users to report a problem. Monitor important metrics, establish useful alerts, understand normal database behavior, and investigate unusual changes before they become major incidents.' },
    ],
  },
  {
    id: 'dataadmin-9',
    thumbnail: 'https://readdy.ai/api/search-image?query=Database%20maintenance%20concept%20with%20wrench%2C%20health%20check%20clipboard%2C%20index%20tools%20and%20calendar%20schedule%20icons%2C%20routine%20upkeep%20illustration%2C%20minimal%20flat%20design%20aesthetic%2C%20soft%20cool%20neutral%20tones%2C%20clean%20light%20background&width=640&height=360&seq=dataadmin-9-thumb&orientation=landscape',
    title: 'Database Maintenance',
    category: 'database',
    categoryName: 'Database Administrator',
    description: 'Learn how to maintain databases through routine health checks, backups, index maintenance, statistics updates, storage management, log management, software updates, and integrity checks.',
    difficulty: 3,
    estimatedMinutes: 55,
    orderIndex: 9,
    prerequisites: ['dataadmin-8'],
    xpReward: 110,
    icon: 'ri-tools-line',
    content: [
        { type: 'heading', content: 'What is Database Maintenance?' },
        { type: 'text', content: 'Database maintenance is the collection of routine tasks performed to keep a database secure, reliable, available, and efficient. Database administrators perform maintenance to prevent problems, manage database growth, maintain performance, verify data integrity, and ensure that recovery procedures continue to work correctly.' },

        { type: 'heading', content: 'Why Database Maintenance Matters' },
        { type: 'text', content: 'Databases change continuously as users and applications insert, update, and delete information. Over time, database files, indexes, logs, and storage requirements can grow. Regular maintenance helps administrators identify potential problems and keep the database operating efficiently.' },

        { type: 'list', items: [
            'Maintain database performance',
            'Protect data integrity',
            'Manage storage usage',
            'Maintain indexes and statistics',
            'Verify backups',
            'Control database growth',
            'Review logs and errors',
            'Apply software updates and security patches',
            'Detect database problems early'
        ] },

        { type: 'heading', content: 'Database Maintenance Tasks' },
        { type: 'text', content: 'The exact maintenance tasks depend on the database management system, workload, and organizational requirements. Common maintenance activities include backups, integrity checks, index maintenance, statistics maintenance, storage management, log management, monitoring, and software updates.' },

        { type: 'list', items: [
            'Backup verification',
            'Database integrity checks',
            'Index maintenance',
            'Statistics maintenance',
            'Storage management',
            'Log management',
            'Database growth monitoring',
            'Software updates',
            'Security patching',
            'Reviewing database errors and warnings'
        ] },

        { type: 'heading', content: 'Database Health Checks' },
        { type: 'text', content: 'A database health check is a routine examination of the database and its supporting environment. Administrators can review availability, storage, performance, errors, connections, backups, and other important indicators to identify conditions that require attention.' },

        { type: 'code', language: 'text', content: 'Database Health Check\n        ↓\nCheck Availability\n        ↓\nCheck Storage\n        ↓\nCheck Errors & Logs\n        ↓\nCheck Performance\n        ↓\nCheck Backups\n        ↓\nCheck Database Integrity\n        ↓\nDocument Findings' },

        { type: 'heading', content: 'Backup Verification' },
        { type: 'text', content: 'Creating backups is only part of a backup strategy. Administrators should also verify that backup operations complete successfully and periodically test whether backups can actually be restored. A backup that cannot be restored may not provide reliable protection during a failure.' },

        { type: 'list', items: [
            'Check whether backups completed successfully',
            'Review backup logs',
            'Verify backup storage',
            'Check backup retention',
            'Perform test restores',
            'Document recovery procedures'
        ] },

        { type: 'tip', content: 'Never assume that a backup is usable simply because a backup job reported success. Regular restore testing provides stronger evidence that the recovery process works.' },

        { type: 'heading', content: 'Database Integrity Checks' },
        { type: 'text', content: 'Database integrity checks help identify corruption or inconsistencies in database structures and stored data. Database systems provide different tools and commands for checking database integrity, so administrators should follow the procedures recommended for their specific DBMS.' },

        { type: 'heading', content: 'Index Maintenance' },
        { type: 'text', content: 'Indexes can improve query performance, but their effectiveness can change as data is inserted, updated, and deleted. Depending on the database platform, administrators may need to reorganize, rebuild, or otherwise maintain indexes. Index maintenance should be based on actual database conditions rather than performed unnecessarily.' },

        { type: 'code', language: 'sql', content: '-- PostgreSQL example\n-- Rebuild an index when appropriate\nREINDEX INDEX idx_students_email;' },

        { type: 'heading', content: 'Database Statistics' },
        { type: 'text', content: 'Database optimizers use statistics about tables and data distribution when choosing execution plans. When statistics become outdated, the optimizer may make less effective decisions. Administrators may therefore need to update or analyze statistics according to the database platform and workload.' },

        { type: 'code', language: 'sql', content: '-- PostgreSQL example\nANALYZE students;' },

        { type: 'heading', content: 'Storage Management' },
        { type: 'text', content: 'Database storage includes table data, indexes, transaction logs, temporary files, and other database objects. Administrators should monitor storage consumption and plan for database growth. Uncontrolled storage growth can eventually prevent database operations from completing.' },

        { type: 'list', items: [
            'Monitor available disk space',
            'Track database growth',
            'Identify unusually large tables',
            'Review large indexes',
            'Manage transaction and log files',
            'Plan additional storage when necessary'
        ] },

        { type: 'heading', content: 'Managing Database Logs' },
        { type: 'text', content: 'Database logs provide useful information about errors, warnings, connections, transactions, and system activity. Log files can also consume storage over time, so administrators need to balance log retention requirements with available storage.' },

        { type: 'code', language: 'text', content: 'Database Logs\n     │\n     ├── Errors\n     ├── Warnings\n     ├── Connections\n     ├── Administrative Events\n     └── System Activity\n              ↓\n       Review & Analyze\n              ↓\n       Archive or Retain\n       According to Policy' },

        { type: 'heading', content: 'Removing Unnecessary Data' },
        { type: 'text', content: 'Some databases contain temporary, obsolete, or historical data that may no longer need to remain in the primary database. Data should only be removed according to organizational policies, retention requirements, and application needs. Deleting data without a proper plan can result in permanent data loss.' },

        { type: 'tip', content: 'Do not delete old database records simply to free storage. Check retention policies, legal requirements, application dependencies, and backup requirements before removing data.' },

        { type: 'heading', content: 'Database Growth Management' },
        { type: 'text', content: 'Database administrators should understand how quickly a database is growing. Monitoring historical growth can help predict future storage requirements and prevent unexpected capacity problems.' },

        { type: 'code', language: 'text', content: 'Current Database Size\n          ↓\nHistorical Growth Data\n          ↓\nCalculate Growth Trend\n          ↓\nEstimate Future Size\n          ↓\nPlan Storage Capacity' },

        { type: 'heading', content: 'Software Updates and Patches' },
        { type: 'text', content: 'Database software receives updates that can provide security fixes, bug fixes, performance improvements, and new functionality. Administrators should maintain supported versions and apply appropriate updates according to organizational change-management procedures.' },

        { type: 'list', items: [
            'Review available updates',
            'Check compatibility',
            'Read release notes',
            'Test updates when possible',
            'Create or verify backups',
            'Plan maintenance windows',
            'Apply the update',
            'Verify database operation afterward'
        ] },

        { type: 'heading', content: 'Maintenance Windows' },
        { type: 'text', content: 'A maintenance window is a planned period during which administrators perform tasks that may affect database availability or performance. Maintenance should be scheduled during appropriate periods and communicated to affected users or teams.' },

        { type: 'code', language: 'text', content: 'Plan Maintenance\n       ↓\nNotify Stakeholders\n       ↓\nVerify Backup\n       ↓\nPerform Maintenance\n       ↓\nTest Database\n       ↓\nMonitor System\n       ↓\nDocument Results' },

        { type: 'heading', content: 'Database Configuration Review' },
        { type: 'text', content: 'Database configuration can affect security, performance, resource usage, and availability. Administrators should periodically review important settings and confirm that they still match the database workload and organizational requirements.' },

        { type: 'list', items: [
            'Memory configuration',
            'Connection limits',
            'Logging configuration',
            'Authentication settings',
            'Network configuration',
            'Storage configuration',
            'Backup settings',
            'Security-related settings'
        ] },

        { type: 'heading', content: 'Security Maintenance' },
        { type: 'text', content: 'Database maintenance also includes security-related tasks. Administrators should review user accounts, permissions, authentication settings, security patches, logs, and other controls to ensure that the database remains protected.' },

        { type: 'list', items: [
            'Review inactive accounts',
            'Review user permissions',
            'Remove unnecessary privileges',
            'Apply security updates',
            'Review authentication activity',
            'Check security-related logs',
            'Verify backup protection'
        ] },

        { type: 'heading', content: 'Testing After Maintenance' },
        { type: 'text', content: 'After performing maintenance, administrators should verify that the database and applications continue to work correctly. Testing can include checking database connectivity, executing important queries, reviewing errors, checking application functionality, and monitoring performance.' },

        { type: 'code', language: 'text', content: 'Maintenance Completed\n        ↓\nCheck Database Status\n        ↓\nTest Connections\n        ↓\nRun Important Queries\n        ↓\nCheck Logs\n        ↓\nCheck Application\n        ↓\nMonitor Performance\n        ↓\nConfirm Success' },

        { type: 'heading', content: 'Database Maintenance Schedule' },
        { type: 'text', content: 'Maintenance activities can be organized into different schedules. The frequency depends on the database workload, platform, business requirements, and operational policies.' },

        { type: 'list', items: [
            'Daily — Review alerts, errors, backups, storage, and database health',
            'Weekly — Review performance trends, growth, logs, and maintenance results',
            'Monthly — Review accounts, permissions, configuration, and capacity planning',
            'As Needed — Apply patches, troubleshoot issues, rebuild or reorganize database structures, and perform recovery tests'
        ] },

        { type: 'heading', content: 'Example Database Maintenance Routine' },
        { type: 'code', language: 'text', content: 'Daily\n  ├── Check Database Availability\n  ├── Check Backups\n  ├── Review Alerts\n  └── Check Storage\n\nWeekly\n  ├── Review Performance\n  ├── Review Logs\n  ├── Check Database Growth\n  └── Review Maintenance Tasks\n\nMonthly\n  ├── Review User Access\n  ├── Review Configuration\n  ├── Check Capacity\n  └── Test Recovery Procedures' },

        { type: 'heading', content: 'Database Maintenance Workflow' },
        { type: 'code', language: 'text', content: 'Identify Maintenance Requirement\n              ↓\nReview Database Condition\n              ↓\nCreate Maintenance Plan\n              ↓\nVerify Backup\n              ↓\nPerform Maintenance\n              ↓\nTest Database\n              ↓\nMonitor Results\n              ↓\nDocument Changes' },

        { type: 'heading', content: 'Database Maintenance Best Practices' },
        { type: 'list', items: [
            'Create a documented maintenance schedule',
            'Verify backups regularly',
            'Test database recovery procedures',
            'Monitor storage and database growth',
            'Maintain indexes based on actual workload',
            'Keep database statistics current when required',
            'Review database logs regularly',
            'Apply appropriate security patches',
            'Review user accounts and permissions',
            'Test the database after maintenance',
            'Document maintenance activities and changes',
            'Avoid making unnecessary changes to production databases'
        ] },

        { type: 'heading', content: 'Why Database Maintenance Matters to Data Administrators' },
        { type: 'text', content: 'Database maintenance helps administrators keep database systems reliable, secure, and efficient over time. Regular maintenance reduces the likelihood of unexpected failures, storage problems, performance degradation, and recovery difficulties. It also gives administrators an opportunity to identify problems before they become major incidents.' },

        { type: 'tip', content: 'Database maintenance should be planned, documented, and tested. Always understand what a maintenance operation changes, verify that a reliable backup exists when appropriate, test the result, and document what was done.' },
    ],
  },
];