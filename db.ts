import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const question_str = `
przeczytaj kod:
\`\`\`javascript
function sum(a, b) {
    return a + b;
}
\`\`\`
czy powyższa funkcja w języku JavaScript to:
`;

const description = `
this is the declaration of the function
`;




(async () => {

    const poll = await prisma.poll.findFirst({
        where: { slug: 'lesson-01' },
        include: {
            Question: {
                include: { Option: true },
            },
        },
    });

    console.log(poll);

    await prisma.$disconnect();


    return;
    /*

    const poll = await prisma.poll.findFirst({
        where: {
            slug: 'lesson-01'
        }
    });
    if (poll) {
        const question = await prisma.question.create({
            data: {
                intro_text: question_str,
                outro_text: description,
                Poll: { connect: { poll_id: poll.poll_id } },
                Option: {
                    create: [
                        { label: 'Wyrażenie' },
                        { label: 'Deklaracja' },
                        { label: 'Równanie' }
                    ]
                }
            }
        });
        /*
          const poll = await prisma.poll.create({
          data: {
          name: 'Lekcja 02',
          slug: 'lesson-02'
          }
          });
        */
})();
