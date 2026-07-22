import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

// Set up the connection pool using standard node-postgres
const pool = new pg.Pool({
  connectionString: "postgresql://dashboard_admin:secure_local_password@localhost:5432/dashboard_dev"
})

// Adapt the connection pool straight into the Prisma 7 engine
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Clean out any existing duplicate telemetry elements 
  await prisma.user.deleteMany({})
  await prisma.activity.deleteMany({})

  // Seed default Admin Node
  await prisma.user.create({
    data: {
      name: "Sandbox Administrator",
      username: "admin",
      email: "admin@rcmeycauayanmetro.org",
      role: "Admin",
      position: "System Webmaster Node",
      isOfficer: true,
      isDirector: true,
      birthday: "N/A"
    }
  })

  // Seed club president
  await prisma.user.create({
    data: {
      name: "Arvin Jason Andaya",
      username: "arvinjasonandaya",
      email: "arvin@rcmeycauayanmetro.org",
      role: "Officer",
      position: "Club President",
      isOfficer: true,
      isDirector: false,
      birthday: "March 9"
    }
  })

  // Seed sample project output
  await prisma.activity.create({
    data: {
      type: "Project",
      title: "WASH Clean Water Hub Infrastructure",
      category: "Water, Sanitation, & Hygiene",
      description: "Constructing physical water delivery nodes and comprehensive sanitation framework units.",
      fullDescription: "Deploying physical resource delivery terminals coupled with multi-stage micro-filtration block architecture grids.",
      status: "Ongoing",
      detail: "WASH Infrastructure Deployment Grid",
      galleryImages: ["/carousel 2.jpg"]
    }
  })

  console.log('Database seeding process completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end() // Safely kill the connection pool so the script exits smoothly
  })