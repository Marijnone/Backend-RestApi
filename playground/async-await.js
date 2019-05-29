/* eslint-disable no-console */
const add = (a, b) =>
        new Promise((resolve, reject) => {
                setTimeout(() => {
                        resolve(a + b);
                }, 2000);
        });

const doStuff = async () => {
        const sum = await add(99, 1);
        const sum2 = await add(sum, 50);
        const sum3 = await add(sum2, 5);
        return sum3;
};

doStuff()
        .then(result => {
                console.log('result', result);
        })
        .catch(e => {
                console.log('e', e);
        });
