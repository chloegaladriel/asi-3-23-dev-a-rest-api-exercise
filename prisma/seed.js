import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const roles = [
    {
      name: "admin",
      permissions: {
        set: [
          { action: "create", resource: "user" },
          { action: "read", resource: "user" },
          { action: "update", resource: "user" },
          { action: "delete", resource: "user" },
          { action: "create", resource: "page" },
          { action: "read", resource: "page" },
          { action: "update", resource: "page" },
          { action: "delete", resource: "page" },
          { action: "create", resource: "navigationMenu" },
          { action: "read", resource: "navigationMenu" },
          { action: "update", resource: "navigationMenu" },
          { action: "delete", resource: "navigationMenu" },
        ],
      },
    },
    {
      name: "manager",
      permissions: {
        set: [
          { action: "create", resource: "page" },
          { action: "read", resource: "page" },
          { action: "update", resource: "page" },
          { action: "delete", resource: "page" },
          { action: "create", resource: "navigationMenu" },
          { action: "read", resource: "navigationMenu" },
          { action: "update", resource: "navigationMenu" },
          { action: "delete", resource: "navigationMenu" },
        ],
      },
    },
    {
      name: "editor",
      permissions: {
        set: [{ action: "read", resource: "user" }],
      },
    },
  ]

  for (let role of roles) {
    const { permissions, ...roleData } = role
    const result = await prisma.role.create({
      data: {
        ...roleData,
        permissions: {
          create: permissions.set.map((permission) => ({
            action: permission.action,
            resource: permission.resource,
          })),
        },
      },
    })
    console.log(`Created roles with names: ${result.name}`)
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
