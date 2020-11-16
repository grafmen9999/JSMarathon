const task1 = () => {
  const util = {
    countElements: (row, elements = ['a', 'а']) => {
      let res = 0;

      for (let i = 0; i < row.length; i++) {
        for (let elem of elements) {
          if (row.charAt(i) === elem) {
            res++;
            break;
          }
        }
      }

      return res;
    },
    parseString2Array: (str) => {
      const res = [];
      const arr = str.split(',');

      for (let i = 0; i < arr.length; i++) {
        res.push(arr[i].trim());
      }

      return res;
    },
    getRow: (firstRow, secondRow) => {
      const searchElements = util.parseString2Array(prompt('Какую(-ие) букву(-ы) ищем? (через запятую)', 'a, а'));

      return util.countElements(firstRow, searchElements) > util.countElements(secondRow, searchElements) ? firstRow : secondRow;
    },
  }

  const firstRow = prompt('firstRow', 'мама мыла раму');
  const secondRow = prompt('secondRow', 'собака друг человека');

  alert(util.getRow(firstRow, secondRow)); // мама мыла раму
}