export interface CourseSlide {
  id: string;
  title: string;
  content: string;
  visualPlaceholder?: string;
  type?: 'content' | 'video' | 'interactive' | 'quiz';
  notes?: string[];
  media?: {
    type: 'image' | 'youtube';
    src: string; // Image path or YouTube URL/ID
    alt?: string;
    caption?: string;
  };
}

export interface SubModule {
  id: string;
  title: string;
  slides: CourseSlide[];
}

export interface Module {
  id: string;
  title: string;
  subModules: SubModule[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  modules: Module[];
}

export const renewableEnergyOntarioCourse: Course = {
  id: "renewable-energy-ontario",
  title: "Community Renewable Energy Projects in Ontario",
  subtitle: "How can Communities develop Renewable Energy Projects in Ontario's existing regulatory framework",
  modules: [
    {
      id: "module-0",
      title: "Getting Started",
      subModules: [
        {
          id: "submodule-0-1",
          title: "Course Registration & Overview",
          slides: [
            {
              id: "slide-0-1",
              title: "Welcome & Registration",
              content: `
## Welcome to Your Energy Journey!

This course will guide you through developing renewable energy projects in your community.

**First, let's get you registered** to receive:
- Free PV assessment report
- Personalized project recommendations
- Access to funding opportunities
- Ongoing support throughout your journey

Complete the registration form below to get started.
              `,
              type: 'interactive'
            },
            {
              id: "slide-0-2",
              title: "How to Use This Course",
              content: `
## Your Learning Path

This comprehensive course covers everything you need to know about renewable energy project development in Indigenous communities.

Navigate through the interactive overview below to understand what you'll learn and how to make the most of this course.
              `,
              type: 'interactive'
            },
            {
              id: "slide-0-3",
              title: "Success Story: Taykwa Tagamou Nation",
              content: `
## Learn from Leaders

Before we begin, let's explore how Taykwa Tagamou Nation successfully developed their renewable energy project and became pioneers in the Indigenous energy transition.

Their story demonstrates what's possible when communities take control of their energy future.
              `,
              type: 'interactive'
            }
          ]
        }
      ]
    },
    {
      id: "module-1",
      title: "Module 1: Introduction to Indigenous-Led Energy Projects",
      subModules: [
        {
          id: "submodule-1-1",
          title: "Community Energy Needs and Vision",
          slides: [
            {
              id: "slide-1",
              title: "First Nation Energy Transition",
              content: `
## Global Context: The Paris Agreement
- Signed by 196 countries in 2015
- Aims to Limit global warming below 2°C above pre-industrial levels
- Calls for urgent reduction of greenhouse gas (GHG) emissions

## Canadian Context:
- The Government of Canada has committed to achieving net-zero emissions by 2050 through the Canadian Net-Zero Emissions Accountability Act and 2030 Emissions Reductions Plan
- As per the 2030 Emissions Reduction Plan roadmap, it will reduce emissions by 40-45% from 2005 level by 2030
- Through the plan, Canada is taking a sector-by-sector approach, with a strong focus on the building and electricity sectors
              `,
              media: {
                type: 'image',
                src: '/course-assets/renewable-energy-ontario/images/paris-agreement-goals.png',
                alt: 'Paris Agreement Climate Goals',
                caption: 'Global commitment to limit warming to 1.5°C above pre-industrial levels'
              },
              type: 'content'
            },
            {
              id: "slide-2",
              title: "First Nations Energy Transition and their role in Global Energy Transition",
              content: `
- For First Nations, Inuit, and Métis, the energy transition is integral for promoting their self-determination and environmental stewardship through sustainable energy development
- Many Indigenous communities are already playing a leading role in Canada's clean energy movement; they are also paving the way for other communities in becoming self-sustaining by reducing their reliance on fossil fuels and resulting carbon emissions

### Project Examples:
- **Wiikwemkoong unceded Territory**: 704 kW grid connected net metered systems
- **Oneida Nations of the Thames**: 637 kW net metered systems + 38 kWh Battery Energy Storage
- **Taykwa Tagamou Nation**: 345 kW Net metered systems + 38 kWh Battery Energy Storage
- **Lac Des mille Lacs First Nation**: Off grid system: 97 kW solar + 250 kWh Battery Storage + Domestic Hot Water
              `,
              visualPlaceholder: "Map of Canada with First Nation Clean Energy projects/initiatives marked across provinces",
              type: 'content'
            },
            {
              id: "slide-3",
              title: "Benefits of Clean Energy Transition to Indigenous Communities",
              content: `
## Key Benefits:

### 💰 Reduced Energy Bills and Energy Poverty

### 👷 Jobs and Training for Youth

### 🏠 Healthier Homes and Environment

### ⚡ Energy Independence and Self-Determination
              `,
              type: 'content'
            },
            {
              id: "slide-4",
              title: "Why & How do you determine your Community's Energy Needs/Vision",
              content: `
## Why should you understand your Community's energy needs:
Strong need will lead the community to stronger goals/vision. A strong vision guides long term planning and achieving the community goals.

## How to get started:
- Conduct a community energy survey
- Review current energy usage (Electricity bills)
- Engage elders, youth and leadership
- Create a vision statement
- Survey/Quiz – Top priorities, energy challenges
              `,
              type: 'interactive'
            },
            {
              id: "slide-5",
              title: "Community Energy Plan (CEP) and Net Zero Plan",
              content: `
## What is CEP and why does a community need it?
- A strategic roadmap for a community's energy future
- Identifies current energy use, community priorities, and clean energy opportunities
- Helps attract funding, partnerships, and guide long-term decision-making

## What is a Net-Zero Plan (NZP)?
- A plan to reduce or offset all greenhouse gas emissions from electricity use
- Sets clear timelines and strategies (e.g., "Net-zero electricity by 2030")
- Includes renewables, storage, efficiency, and fuel switching

## Why Does a Community Need These Plans?
- Aligns energy projects with local values, needs, and economic goals
- Builds a clear case for investment and funding
- Enables self-determination and reduces energy vulnerability
- Supports participation in broader initiatives like the IEX SuperGrid

## Benefits of CEP & NZP:
- Identify growing energy demand from homes, new housing, or infrastructure
- Explore sustainable options like solar, batteries, and efficiency retrofits
- Unlock economic opportunities like local jobs, training, and revenue from clean energy
- Guide project planning and attract funding
- Engage community members in shaping energy decisions
              `,
              type: 'content'
            },
            {
              id: "slide-6",
              title: "TTN's Roadmap – Development of Community Energy Plan & Net Zero Plan",
              content: `
## Roadmap for developing CEP:

1. **Community Interest**
2. **Application submission - IESO (IESP)**
3. **Approval from IESP**
4. **Preparation of Community Energy Plan**

## Roadmap for developing Net Zero Plan:
- What are the highlights of these plans
- How does it impact the First Nation communities?
              `,
              type: 'content'
            },
            {
              id: "slide-7",
              title: "Funding Options for developing Community Energy Plan across Provinces",
              content: `
## Provincial Funding Options:

### Ontario
**IESO – Indigenous Energy Support Program (IESP)**
- Energy Resilience & Monitoring – up to $135,000 per application

### Saskatchewan & Manitoba
- No specific province-wide CEP funds
- Communities often access federal programs or partner with utilities (e.g., Manitoba Hydro or SaskPower Indigenous programs)

### Alberta
**Indigenous Climate Leadership Initiative (ICLI)**
- Includes support for community energy planning and clean energy project design

### British Columbia
**BC Indigenous Clean Energy Initiative (BCICEI)**
- Supports clean energy planning and project development
- Co-funded by federal and provincial governments
              `,
              type: 'content'
            },
            {
              id: "slide-8",
              title: "Video Interview",
              content: `
## Indigenous Energy Leaders Share Their Experience

Indigenous energy leaders share their experience and timelines to develop a CEP/Net Zero Plan (TTN)
              `,
              media: {
                type: 'youtube',
                src: 'dQw4w9WgXcQ', // Replace with actual video ID
                alt: 'Indigenous Energy Leaders Interview'
              },
              type: 'video'
            }
          ]
        },
        {
          id: "submodule-1-2",
          title: "Renewable Energy Project Scoping",
          slides: [
            {
              id: "slide-9",
              title: "Comparison of RE Technologies",
              content: `
## Renewable Energy Technology Options
              `,
              visualPlaceholder: "Graphic comparison of RE technologies (rooftop, ground-mount, storage, microgrids)",
              type: 'content'
            },
            {
              id: "slide-10",
              title: "Explanation of Different RE Technologies",
              content: `
## Understanding Renewable Energy Technologies

### Solar Photovoltaic (PV)
- Rooftop systems
- Ground-mount systems
- Community solar

### Energy Storage
- Battery storage systems
- Grid stabilization
- Backup power

### Microgrids
- Island mode capability
- Grid-connected with backup
- Community resilience
              `,
              type: 'content'
            },
            {
              id: "slide-11",
              title: "Different Types of Solar Projects",
              content: `
## Solar Project Types:

### Net Metering
- Connected to the grid
- Offset your own consumption
- Sell excess back to grid

### Community Net Metering
- Shared solar projects
- Multiple beneficiaries
- Virtual allocation of credits

### Utility Scale
- Large-scale generation
- Power purchase agreements
- Revenue generation

### Microgrids
- Energy independence
- Resilience during outages
- Combined with storage
              `,
              type: 'content'
            },
            {
              id: "slide-12",
              title: "Match Project Type to Community Goals",
              content: `
## Interactive Tool: Match Your Community Goals

### Consider These Factors:
- **Revenue Generation**
- **Energy Savings**
- **Job Creation**
- **Land Availability**
- **Budget Availability**
- **Grid Connectivity**
              `,
              type: 'interactive'
            },
            {
              id: "slide-13",
              title: "How to Design a Solar Project",
              content: `
## Design Process Flowchart

### Key Considerations:

#### Site Assessment Factors
- Solar resource
- Shading analysis
- Land/roof suitability

#### Technical Feasibility
- Grid capacity
- Interconnection requirements
- System sizing

#### Regulatory & Legal Considerations
- Permits required
- Zoning compliance
- Environmental assessments

#### Financial Feasibility
- Capital costs
- Operating costs
- Revenue projections
              `,
              type: 'content'
            },
            {
              id: "slide-14",
              title: "Financing Options Matrix",
              content: `
## Financing Your Project

### Grants
- Non-repayable funding
- Government programs
- Foundation support

### Loans
- Traditional financing
- Green bonds
- Community loans

### Equity
- Community investment
- Partner investment
- Crowdfunding

### Revenue-sharing
- Power purchase agreements
- Net metering credits
- Carbon credits
              `,
              visualPlaceholder: "Visual chart - Financing Options Matrix",
              type: 'content'
            },
            {
              id: "slide-15",
              title: "Case Study Videos",
              content: `
## Learn from Indigenous Community Examples

- **Rooftop**: TTN Project
- **Ground Mount**: [Community Example]
- **Microgrid**: [Community Example]
- **Storage**: [Community Example]
              `,
              visualPlaceholder: "Space for case study videos",
              type: 'video'
            }
          ]
        },
        {
          id: "submodule-1-3",
          title: "Ontario's Regulatory Context",
          slides: [
            {
              id: "slide-16",
              title: "How Ontario's Electricity Sector Works",
              content: `
## Understanding Ontario's Electricity System
              `,
              visualPlaceholder: "Whiteboard animation - How Ontario's electricity sector works",
              type: 'content'
            },
            {
              id: "slide-17",
              title: "Key Players in Ontario's Energy Sector",
              content: `
## Role Map - Key Organizations

### IESO (Independent Electricity System Operator)
- Manages electricity system
- Runs energy programs
- Facilitates markets

### LDCs (Local Distribution Companies)
- Deliver electricity
- Connect projects
- Bill customers

### OEB (Ontario Energy Board)
- Regulates sector
- Sets rates
- Protects consumers

### Others
- Hydro One (transmission)
- Ontario Power Generation
- Private generators
              `,
              visualPlaceholder: "Role map visualization",
              type: 'content'
            },
            {
              id: "slide-18",
              title: "Net Metering vs Virtual vs Community Net Metering",
              content: `
## Understanding Different Net Metering Options

### Net Metering
- Single customer
- Behind-the-meter
- Direct offset

### Virtual Net Metering
- Multiple meters
- Same customer
- Credit allocation

### Community Net Metering
- Multiple customers
- Shared project
- Community benefits
              `,
              type: 'interactive'
            },
            {
              id: "slide-19",
              title: "Indigenous Energy Rights in Ontario",
              content: `
## Spotlight: Indigenous Energy Rights

### Treaty Rights
- Constitutional protection
- Duty to consult
- Resource development

### UNDRIP Implementation
- Free, prior, informed consent
- Self-determination
- Economic participation

### Ontario Programs
- Indigenous-specific funding
- Capacity building support
- Partnership opportunities
              `,
              type: 'content'
            }
          ]
        },
        {
          id: "submodule-1-4",
          title: "Project Development Process",
          slides: [
            {
              id: "slide-20",
              title: "Five-Phase Development Cycle",
              content: `
## Project Development Phases

### 1. Concept Phase
- Initial idea
- Community engagement
- Preliminary assessment

### 2. Feasibility Phase
- Technical studies
- Financial analysis
- Regulatory review

### 3. Financing Phase
- Secure funding
- Final agreements
- Financial close

### 4. EPC Phase (Engineering, Procurement, Construction)
- Detailed design
- Equipment procurement
- Construction

### 5. Operations Phase
- Commissioning
- Ongoing operations
- Maintenance
              `,
              type: 'content'
            },
            {
              id: "slide-21",
              title: "Net Metering Residential Example",
              content: `
## Residential Net Metering Project Example

### Project Overview
- System size: 10 kW
- Annual generation: 12,000 kWh
- Payback period: 7-10 years

### Key Steps
1. Energy audit
2. System design
3. Utility application
4. Installation
5. Commissioning

### Benefits
- Reduced electricity bills
- Environmental impact
- Energy independence
              `,
              type: 'content'
            },
            {
              id: "slide-22",
              title: "Net Metering Commercial",
              content: `
## Commercial Net Metering Project

### Project Scale
- System size: 100-500 kW
- Roof or ground mount
- Multiple buildings possible

### Business Case
- Demand charge reduction
- Energy cost savings
- Corporate sustainability

### Implementation
- Feasibility study
- Procurement process
- Construction management
- Operations planning
              `,
              type: 'content'
            },
            {
              id: "slide-23",
              title: "Utility Scale Project Examples",
              content: `
## Utility Scale Solar Projects

### Project Characteristics
- Size: 1 MW+
- Grid-connected
- Revenue generation focus

### Development Process
- Land acquisition/lease
- Environmental assessment
- Grid connection study
- Power purchase agreement
- Construction (12-18 months)
- 20+ year operation

### Community Benefits
- Jobs during construction
- Long-term revenue
- Local economic development
              `,
              type: 'content'
            }
          ]
        }
      ]
    },
    {
      id: "module-2",
      title: "Module 2: Feasibility Study",
      subModules: [
        {
          id: "submodule-2-1",
          title: "Site Assessment",
          slides: [
            {
              id: "slide-24",
              title: "Scoring Factors – Site Assessment",
              content: `
## Site Assessment Scoring Criteria

### Solar Resource (25%)
- Annual solar irradiation
- Shading analysis
- Seasonal variations

### Physical Characteristics (25%)
- Size and orientation
- Slope and terrain
- Soil conditions

### Grid Access (25%)
- Distance to connection
- Capacity available
- Upgrade requirements

### Environmental (25%)
- Sensitive areas
- Permitting complexity
- Community acceptance
              `,
              type: 'content'
            },
            {
              id: "slide-25",
              title: "How to do a Grid Capacity Check",
              content: `
## Grid Capacity Assessment Process

### Step 1: Contact Your LDC
- Request capacity information
- Feeder maps
- Historical loading data

### Step 2: Preliminary Assessment
- Available capacity
- Voltage level
- Distance to substation

### Step 3: Formal Application
- Connection Impact Assessment
- System Impact Assessment
- Facility Study

### Key Considerations
- Thermal limits
- Voltage limits
- Protection requirements
              `,
              type: 'content'
            },
            {
              id: "slide-26",
              title: "How to Conduct a Site Assessment",
              content: `
## Site Assessment Methodology

### Desktop Analysis
- GIS mapping
- Solar resource data
- Zoning verification

### Field Assessment
- Physical measurements
- Shading analysis
- Soil testing
- Environmental scan

### Documentation
- Site photos
- Survey results
- Assessment report
- Recommendations
              `,
              type: 'content'
            },
            {
              id: "slide-27",
              title: "Energy Consumption Analysis",
              content: `
## Analyzing Your Hydro Bills

### Data Collection
- 12-24 months of bills
- Hourly data if available
- Peak demand records

### Analysis Steps
1. Load profile creation
2. Seasonal variations
3. Peak demand timing
4. Rate class optimization

### Sizing Considerations
- Base load vs peak
- Future growth
- Electrification plans
- EV charging needs
              `,
              type: 'content'
            }
          ]
        },
        {
          id: "submodule-2-2",
          title: "Technical Feasibility",
          slides: [
            {
              id: "slide-28",
              title: "Plant Layout and System Design",
              content: `
## System Design Fundamentals

### Layout Considerations
- Module orientation
- Row spacing
- Access roads
- Electrical routing

### Key Components
- Solar modules
- Inverters
- Transformers
- Switchgear
- Monitoring system

### Design Optimization
- Minimize shading
- Reduce losses
- Maintenance access
- Future expansion
              `,
              type: 'content'
            },
            {
              id: "slide-29",
              title: "How to Design a PV System",
              content: `
## PV System Design Process

### Step 1: Energy Yield Calculation
- Solar resource assessment
- System losses
- Performance ratio

### Step 2: Equipment Selection
- Module technology
- Inverter sizing
- Mounting systems

### Step 3: Electrical Design
- DC system design
- AC collection
- Grounding system
- Protection devices

### Step 4: Layout Optimization
- String configuration
- Cable routing
- Equipment placement
              `,
              type: 'content'
            },
            {
              id: "slide-30",
              title: "Preliminary Structural Assessment",
              content: `
## Structural Requirements

### Rooftop Systems
- Load capacity analysis
- Age and condition
- Attachment methods
- Waterproofing

### Ground Mount Systems
- Foundation design
- Wind loading
- Snow loading
- Seismic considerations

### Key Assessments
- Structural engineer review
- Building code compliance
- Safety factors
- Remediation needs
              `,
              type: 'content'
            }
          ]
        },
        {
          id: "submodule-2-3",
          title: "Regulatory & Legal Considerations",
          slides: [
            {
              id: "slide-31",
              title: "Building Permits",
              content: `
## Understanding Building Permit Requirements

### When Required
- Rooftop installations
- Ground mount structures
- Electrical upgrades
- New buildings

### Documentation Needed
- Site plans
- Structural drawings
- Electrical diagrams
- Engineer stamps

### Typical Timeline
- Application: 2-4 weeks
- Review: 4-8 weeks
- Inspections: During construction
              `,
              type: 'content'
            },
            {
              id: "slide-32",
              title: "Steps to Getting Permits",
              content: `
## Permit Application Process

### Step 1: Pre-Application Meeting
- Meet with building department
- Understand requirements
- Identify potential issues

### Step 2: Prepare Documents
- Complete application forms
- Compile drawings
- Engineer reviews

### Step 3: Submit & Track
- Submit application
- Respond to comments
- Schedule inspections

### Step 4: Close Out
- Final inspection
- Occupancy permit
- As-built drawings
              `,
              type: 'content'
            },
            {
              id: "slide-33",
              title: "Grid Interconnection Process",
              content: `
## Connecting to the Grid

### Application Process
1. Initial inquiry
2. Preliminary assessment
3. Connection agreement
4. Design approval
5. Construction
6. Commissioning

### Key Requirements
- Single line diagram
- Protection settings
- Metering plan
- Operating procedures

### Timeline
- Small systems: 2-3 months
- Large systems: 6-12 months
              `,
              type: 'content'
            },
            {
              id: "slide-34",
              title: "Navigating the Interconnection Process",
              content: `
## Tips for Successful Interconnection

### Do's
- Engage LDC early
- Provide complete information
- Meet deadlines
- Maintain communication

### Don'ts
- Skip preliminary assessment
- Undersize equipment
- Ignore technical requirements
- Rush the process

### Common Issues
- Capacity constraints
- Protection coordination
- Metering requirements
- Communication protocols
              `,
              type: 'content'
            }
          ]
        },
        {
          id: "submodule-2-4",
          title: "Financial Feasibility",
          slides: [
            {
              id: "slide-35",
              title: "Capital Cost Estimates",
              content: `
## Understanding Project Costs

### Major Cost Categories
- Equipment (40-50%)
  - Modules
  - Inverters
  - Mounting/racking
- Installation (20-30%)
  - Labor
  - Equipment rental
  - Commissioning
- Soft Costs (20-30%)
  - Development
  - Engineering
  - Permitting
  - Financing

### Cost Benchmarks (2024)
- Residential: $2.50-3.50/W
- Commercial: $1.50-2.50/W
- Utility: $1.00-1.50/W
              `,
              type: 'content'
            },
            {
              id: "slide-36",
              title: "How to Calculate Project Costs",
              content: `
## Project Cost Calculation

### Step 1: Equipment Costs
- Module cost × quantity
- Inverter cost × quantity
- BOS components
- Add 5-10% contingency

### Step 2: Installation Costs
- Labor hours × rate
- Equipment rental
- Contractor markup
- Commissioning costs

### Step 3: Soft Costs
- Development (5-10%)
- Engineering (3-5%)
- Legal/permitting (2-3%)
- Financing costs

### Step 4: Total & Validate
- Sum all categories
- Compare to benchmarks
- Get multiple quotes
              `,
              type: 'content'
            },
            {
              id: "slide-37",
              title: "Break Even Cost/Payback Period",
              content: `
## Financial Metrics

### Simple Payback
- Total cost ÷ Annual savings
- Typically 7-12 years
- Doesn't consider financing

### Net Present Value (NPV)
- Present value of cash flows
- Considers time value of money
- Positive NPV = good investment

### Levelized Cost of Energy (LCOE)
- Total lifecycle cost ÷ Total energy
- Compare to utility rates
- Lower = better
              `,
              type: 'content'
            },
            {
              id: "slide-38",
              title: "Calculating Payback & IRR",
              content: `
## Financial Analysis Tools

### Payback Calculation
1. Annual energy production (kWh)
2. Energy value ($/kWh)
3. Annual revenue/savings
4. Operating costs
5. Net annual benefit
6. Payback = Cost ÷ Benefit

### IRR Calculation
- Use 20-25 year analysis
- Include all cash flows
- Consider incentives
- Account for degradation
- Target IRR: 8-15%

### Try the Interactive Calculator
Use the calculator below to estimate payback period for your community's solar project.
              `,
              type: 'interactive'
            }
          ]
        }
      ]
    },
    {
      id: "module-3",
      title: "Module 3: Funding & Partnerships",
      subModules: [
        {
          id: "submodule-3-1",
          title: "Federal Funding Opportunities",
          slides: [
            {
              id: "slide-39",
              title: "How to Apply for Federal Funding",
              content: `
## Federal Funding Programs

### Natural Resources Canada (NRCan)
**Clean Energy for Indigenous and Remote Communities (CEIRC)**
- Purpose: Funds capacity building, planning, and clean energy projects that reduce reliance on diesel
- Funding: Up to 100% of eligible costs
- Focus: Community energy planning, feasibility studies, training, and deployment

### NRCan - Energy Innovation Program (EIP)
**Smart Grid Regulatory Innovation Capacity Building**
- Purpose: Support Indigenous communities to build capacity, participate in regulatory innovation, and lead energy transitions
- Funding: Up to 75% of total costs (max $1.5M); Indigenous recipients may qualify for 100% of costs
- Eligible Activities: CEP development, training, regulatory analysis, engagement, and advocacy
- Example: Taykwa Tagamou Nation's IEX SuperGrid Project

### Application Tips
- Start early - applications take time
- Engage with program officers
- Clearly demonstrate community benefits
- Show Indigenous leadership
- Include capacity building components
              `,
              type: 'content'
            }
          ]
        },
        {
          id: "submodule-3-2",
          title: "Provincial Funding Opportunities",
          slides: [
            {
              id: "slide-40",
              title: "Provincial Funding Programs",
              content: `
## Ontario Programs

### IESO – Indigenous Energy Support Programs (IESP)
- Includes the Aboriginal Community Energy Plan (ACEP) program
- Funding: Up to $200,000 to develop new or update existing CEPs
- Eligible Activities: Community engagement, audits, planning, feasibility assessments

## Other Provincial Programs

### British Columbia
**BC Indigenous Clean Energy Initiative (BCICEI)**
- Supports clean energy planning and project development
- Co-funded by federal and provincial governments

### Alberta
**Indigenous Climate Leadership Initiative (ICLI)**
- Includes support for community energy planning and clean energy project design

### Manitoba & Saskatchewan
- No specific province-wide CEP funds
- Communities often access federal programs or partner with utilities
              `,
              type: 'content'
            }
          ]
        },
        {
          id: "submodule-3-3",
          title: "Partnership Opportunities",
          slides: [
            {
              id: "slide-41",
              title: "Building Strategic Partnerships",
              content: `
## Partnership Models

### Equity Partnerships
- Community owns percentage
- Share in revenues and decisions
- Long-term wealth building

### Development Partnerships
- Partner provides expertise
- Community provides land/support
- Shared development costs

### Service Agreements
- Community provides services
- Employment opportunities
- Capacity building

### Key Considerations
- Alignment of values
- Fair benefit sharing
- Capacity building included
- Exit strategies
              `,
              type: 'content'
            },
            {
              id: "slide-42",
              title: "TTN Case Study",
              content: `
## Taykwa Tagamou Nation Success Story

### Project Overview
- 345 kW Net metered systems
- 38 kWh Battery Energy Storage
- Community-led development

### Key Success Factors
- Strong leadership support
- Community engagement
- Strategic partnerships
- Phased approach

### Outcomes
- Energy cost savings
- Local employment
- Capacity building
- Model for other communities

### Lessons Learned
- Start with feasibility
- Build internal capacity
- Engage community early
- Plan for operations
              `,
              type: 'content'
            }
          ]
        }
      ]
    },
    {
      id: "module-4",
      title: "Module 4: IEX SuperGrid Vision & Capacity Building",
      subModules: [
        {
          id: "submodule-4-1",
          title: "IEX SuperGrid Vision",
          slides: [
            {
              id: "slide-43",
              title: "Vision Animation",
              content: `
## IEX SuperGrid Vision

"Now imagine Indigenous communities connected through a borderless SuperGrid—sharing clean power across provinces."

### The Vision
- Indigenous-led energy network
- Cross-provincial cooperation
- Clean energy sharing
- Economic sovereignty
              `,
              visualPlaceholder: "Map animation showing interties lighting up (ON, MB, SK, AB)",
              type: 'content'
            },
            {
              id: "slide-44",
              title: "Regulatory Dashboard",
              content: `
## Provincial Regulatory Landscape

"Each province has its own rules. Some are supportive, others less so."

### Regulatory Progress
- **Ontario**: 70% supportive
- **Alberta**: 60% supportive
- **British Columbia**: 75% supportive
- **Manitoba**: 65% supportive
- **Saskatchewan**: 55% supportive

### Key Challenges
- Interprovincial barriers
- Regulatory harmonization
- Indigenous jurisdiction
              `,
              visualPlaceholder: "Dashboard with progress bars",
              type: 'content'
            },
            {
              id: "slide-45",
              title: "Roadmap to 2035",
              content: `
## IEX SuperGrid Development Roadmap

"Here's our roadmap to 2035—engagement, pilots, regional grids, and eventually a national Indigenous-led SuperGrid."

### Key Milestones
- **2025**: Community engagement & planning
- **2027**: First interprovincial pilots
- **2030**: Regional grid connections
- **2032**: Expanded network
- **2035**: National SuperGrid operational

### Next Steps
- Join the movement
- Develop your project
- Connect with others
- Build the future
              `,
              visualPlaceholder: "Timeline with milestones",
              type: 'content'
            }
          ]
        },
        {
          id: "submodule-4-2",
          title: "Capacity Building & Implementation",
          slides: [
            {
              id: "slide-46",
              title: "Skills Development",
              content: `
## Building Your Capacity

### Technical Skills
- Solar design basics
- Project management
- Financial analysis
- Operations & maintenance

### Tools & Resources
- Open Solar / Aurora training
- Financial modeling templates
- Project planning guides
- Best practices library

### Support Network
- Peer communities
- Technical advisors
- Training programs
- Mentorship opportunities
              `,
              type: 'content'
            }
          ]
        }
      ]
    },
    {
      id: "module-5",
      title: "Wrap-Up",
      subModules: [
        {
          id: "submodule-5-1",
          title: "Assessment & Certification",
          slides: [
            {
              id: "slide-47",
              title: "Knowledge Quiz",
              content: `
## Test Your Knowledge

Let's test your knowledge with a short quiz covering all the modules.

### Quiz Topics:
- First Nations energy transition
- Renewable energy technologies
- Ontario regulatory framework
- Project development process
- Feasibility studies
- Funding opportunities
- IEX SuperGrid vision

### Ready to begin?
              `,
              type: 'quiz'
            },
            {
              id: "slide-48",
              title: "Course Completion",
              content: `
## Congratulations! 🎉

You've completed the course on **Community Renewable Energy Projects in Ontario**.

### Your Achievements:
- ✅ Understood Indigenous-led energy transition
- ✅ Learned about renewable energy technologies
- ✅ Navigated Ontario's regulatory framework
- ✅ Mastered project development process
- ✅ Explored funding opportunities
- ✅ Connected with the IEX SuperGrid vision

### Next Steps:
1. **Download your toolkit** - Access templates and resources
2. **Receive your certificate** - Recognition of completion
3. **Join the community** - Connect with other Indigenous energy leaders
4. **Start your project** - Apply what you've learned

### Resources Available:
- Project planning templates
- Financial modeling tools
- Regulatory guides
- Community engagement materials
- Technical specifications

Thank you for joining us on this journey toward energy sovereignty and sustainability!
              `,
              type: 'content'
            }
          ]
        }
      ]
    }
  ]
};
