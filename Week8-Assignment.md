# 🏆 Week 8: Capstone Project and Presentation – Bringing Your MERN Skills Together

## 🚀 Objective
Design, develop, and deploy a comprehensive full-stack MERN application that showcases all the skills you've learned throughout the course, including database design, RESTful API development, real-time features, testing, and deployment.

## 📂 Tasks

### Task 1: Project Planning and Design
- Choose a project idea that solves a real-world problem
- Create wireframes and mockups for your application
- Design the database schema and relationships
- Plan the API endpoints and data flow
- Create a project roadmap with milestones
- Document your technical architecture decisions

### Task 2: Backend Development
- Set up a MongoDB database with appropriate schemas and validation
- Develop a RESTful API using Express.js with proper error handling
- Implement authentication and authorization
- Create middleware for logging, validation, and security
- Add real-time functionality with Socket.io where appropriate
- Write comprehensive tests for your API endpoints

### Task 3: Frontend Development
- Build a responsive UI using React and modern CSS techniques
- Implement client-side routing with React Router
- Create reusable components with proper state management
- Connect to the backend API and handle data fetching
- Add form validation and error handling
- Implement real-time updates on the client side

### Task 4: Testing and Quality Assurance
- Write unit tests for critical components and functions
- Implement integration tests for API endpoints
- Add end-to-end tests for critical user flows
- Perform manual testing across different devices and browsers
- Conduct code reviews and refactoring as needed
- Ensure the application meets accessibility standards

### Task 5: Deployment and Documentation
- Deploy your application to production (backend and frontend)
- Set up CI/CD pipelines for automated testing and deployment
- Configure monitoring and error tracking
- Create comprehensive documentation for your project:
  - README with setup instructions
  - API documentation
  - User guide
  - Technical architecture overview
- Prepare a presentation showcasing your application

## 🧪 Expected Outcome
- A fully functional, deployed MERN stack application
- Source code in a GitHub repository with proper documentation
- Comprehensive test suite with good coverage
- Live demonstration of the application
- Project presentation highlighting key features and technical decisions

## 🛠️ Project Ideas (Optional)
Here are some project ideas you can consider:
- E-commerce platform with product catalog, cart, and checkout
- Task/project management system with team collaboration
- Social media platform with posts, comments, and real-time notifications
- Learning management system with courses, lessons, and progress tracking
- Health and fitness tracker with data visualization
- Recipe sharing platform with search and filtering
- Job board with application tracking
- Event management system with registration and ticketing

Feel free to come up with your own idea that demonstrates your skills and interests!

## ✅ Submission Instructions
1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Develop your capstone project within this repository
4. Commit and push your code regularly to show progress
5. Include in your repository:
   - Complete source code for both frontend and backend
   - Documentation in the form of README files
   - Tests and CI/CD configuration
6. Deploy your application and ensure it's accessible online
7. Update your main README.md with:
   - A description of your project
   - Setup instructions
   - Link to the deployed application
   - Link to a 5-10 minute video demonstration
   - Screenshots of key features
8. Your final submission will be automatically graded based on the criteria in the autograding configuration
9. The instructor will review your complete project after the final push 


## Rough PRD
# Product Requirements Document (PRD): SpazaChain

## 1. App Overview

**Product Name:** SpazaChain  
**Target Users:** South African township spaza shop owners, suppliers/wholesalers, (optional: group leaders, admins)

**Problem Statement:**  
Spaza shops face prohibitively high purchase costs, fragmented supply chains, weak bargaining power, and chronic inefficiencies. Individual shop owners pay premium prices and have minimal negotiation leverage compared to formal retailers or pooled foreign-owner networks.

**Solution:**  
SpazaChain is a mobile-friendly, community-centric platform empowering local shops to form digital buying groups, negotiate bulk deals, and streamline group procurement—lowering costs, building trust, and boosting local business sustainability.

## 2. App Description

SpazaChain enables spaza owners to:
- Form or join group buying collectives by area
- Pool orders to reach bulk pricing thresholds
- Engage directly with suppliers for better deals
- Track group orders and payment status simply
- Collaborate with peers, building community networks

Suppliers, in turn, gain easy access to consolidated demand in local townships and can optimize delivery and business relationships.

## 3. Core App Logic

### 3.1 User & Role Management
- Register/login (email/password)
- Role assignment: Shop Owner, Supplier, (optional: Admin)
- Profile management for users and shops

### 3.2 Group Management
- Users can create or join groups based on geographic area
- Group directory for discovery
- Group leader designation (creator or voted leader)

### 3.3 Bulk Order Flows
- Group leader initiates a new bulk order (product selection, deadline)
- Members join/commit individual quantities
- App aggregates total order volumes and displays price break estimates
- Order summary with split quantities and costs per shop
- Group submissions create a Request for Offer to suppliers

### 3.4 Supplier Interaction
- Suppliers register and manage product catalog (with multiple price tiers)
- View/join open group order requests and submit offers
- Negotiate and respond with best pricing/delivery options
- Group leader selects a supplier’s offer and confirms the order

### 3.5 Order Status & Tracking
- Each order moves through stages: Open → Awaiting Supplier → Offer Received → Confirmation → Awaiting Payment → Complete
- Users see at-a-glance status and progress
- Mock payment confirmation per member (Paid/Unpaid)
- Delivery or pickup noted at order finalization

### 3.6 Communication (Optional/Recommended)
- Group message board or chat for discussing deals and logistics
- Notifications for order changes, confirmations, payment status

### 3.7 Order History & Quick Reorder (Optional)
- Simple dashboard for users to view past orders
- “Reorder” functionality for efficiency

## 4. Key Features Table

| Feature                      | User Role         | Priority | Description                      |
|------------------------------|------------------|----------|----------------------------------|
| Auth/Login                   | All              | Must     | Secure registration and login    |
| Role Selection               | Onboarding       | Must     | Shop owner or supplier           |
| Group Creation/Join          | Shop Owner       | Must     | Create or join by area           |
| Bulk Order Creation          | Group Leader     | Must     | Start order with products        |
| Order Participation          | Shop Owners      | Must     | Join/crowd orders in group       |
| Supplier Catalog             | Suppliers        | Must     | Manage products and prices       |
| Offer Submission             | Suppliers        | Must     | Respond to group requests        |
| Order Status Tracking        | All              | Must     | Visual, simple progress          |
| Payment (mock) Tracking      | Shop Owners      | Must     | Confirm payment for order        |
| Notifications/Alerts         | All              | Should   | Status, confirmation, reminders  |
| Group Chat/Message Board     | All              | Should   | Collaboration, if time allows    |
| Order/Inventory History      | Shop Owners      | Could    | Easy repeat orders               |
| Admin Dashboard              | Admin            | Bonus    | Monitor activity, demo/grading   |

## 5. User Journeys

### Shop Owner Journey
1. Registers and selects "Shop Owner" role.
2. Creates or joins a group by neighborhood/area.
3. Views ongoing or upcoming bulk orders.
4. Joins existing order(s), specifies quantities.
5. Waits for supplier offer(s); group leader confirms the best deal.
6. Pays (mock confirmation), gets notified of delivery/pickup.

### Supplier Journey
1. Registers, selects "Supplier" role.
2. Lists available products with price tiers.
3. Sees group order requests by area.
4. Submits offer(s) and negotiates details.
5. Gets confirmation, delivers goods as per agreed terms.

## 6. Tech Stack

| Tier          | Technology       | Notes                                                  |
|---------------|------------------|--------------------------------------------------------|
| Frontend      | React            | Responsive, simple UI, mobile-optimized                |
| Backend       | Node.js/Express  | REST API, business logic, role-based access            |
| Database      | MongoDB          | Flexible, accommodates users, orders, groups           |
| Authentication| JWT + Bcrypt     | Secure, role-specific access control                   |
| Real-Time     | Socket.io        | Group chat/order status updates (if included)          |
| Deployment    | Vercel/Render    | Easy, student/demo-friendly                            |

## 7. Visual Design & Color Palette

**Design Values:** Trust, efficiency, friendliness, modern, inclusive

**Recommended Color Palette:**

| Usage            | Color Name         | HEX      |
|------------------|-------------------|----------|
| Primary          | Deep Teal          | #00796B  |
| Secondary        | Sunshine Yellow    | #FFD600  |
| Accent           | Warm Coral         | #FF7043  |
| Background       | Off-White          | #FAFAFA  |
| Text             | Charcoal           | #212121  |
| Borders/Muted    | Soft Grey          | #BDBDBD  |
| Success          | Grass Green        | #43A047  |
| Error            | Soft Red           | #E53935  |

**Style Guidelines:**
- Flat, clean layouts; lots of white space
- Large tap/click targets for mobile users
- Tables and lists for information display
- Simple icons and rounded buttons
- High contrast for accessibility (WCAG AA compliant)

## 8. Non-Functional Requirements

- **Performance:** Loads in <3s on entry, responsive under low bandwidth
- **Accessibility:** Keyboard/touch navigation, screen-reader labels
- **Localization:** Basic multi-language support (en, option for local language stubs)
- **Security:** Encrypted passwords, JWT tokens, proper access control
- **Usability:** Intuitive navigation, clear labels for non-technical users
- **Testing:** Unit tests for core flows (auth, order, supplier)

## 9. Project Milestones

| Stage           | Key Features/Increments                         | Timeline    |
|-----------------|------------------------------------------------|-------------|
| Week 1          | Scaffolding/auth, user roles, DB setup         |             |
| Week 2          | Group functions, simple group logic            |             |
| Week 3          | Bulk order logic, supplier product listing     |             |
| Week 4          | Offer submission/negotiation, order tracking   |             |
| Week 5          | Payment tracking, notifications, chat (opt)    |             |
| Week 6          | Polish UI/UX, bugfix, end-to-end testing       |             |
| Week 7          | Deploy, finalize docs, prepare demo            |             |

## 10. Success Metrics

- **User onboarding <3 min**
- **Order creation & participation: <6 user clicks**
- **Documented cost saving for group orders (mocked)**
- **High group/order engagement in demo**
- **Clean, accessible, error-free UI**

SpazaChain is purposely scoped to show significant value, clear logic, and attractive, inclusive design—making it an ideal capstone project that is achievable and demonstrably impactful.