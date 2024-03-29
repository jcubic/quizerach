import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const question_str = `
Co wyświetli poniższy kod?

\`\`\`javascript
function f(x) {
   return x \\ 2;
}

console.log(f(10))
\`\`\`
`;



(async () => {

    const poll = await prisma.poll.findFirst({
        where: {
            slug: 'lesson-01'
        }
    });
    if (poll) {
        await prisma.question.update({
            where: {
                question_id: 6
            },
            data: {
                intro_text: question_str
            }
        });
        /*
        return;
        await prisma.question.create({
            data: {
                intro_text: question_str,
                outro_text: '',
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
        // */
    }
        /*

    const poll_set = await prisma.set.create({
        data: {
            name: 'Koduj Quiz Utrwalający',
            Poll: {
                create: {
                    slug: 'lesson-01',
                    name: 'Lekcja 01'
                }
            }
        }
    });

    console.log(poll_set);
    return;

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

    
        /*
          const poll = await prisma.poll.create({
          data: {
          name: 'Lekcja 02',
          slug: 'lesson-02'
          }
          });
        */
})();
