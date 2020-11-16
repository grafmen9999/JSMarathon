const task2 = () => {
  const util = {
    formattedPhone: (phone) => {
      // ********************************************************************
      // why not? :D
      // const regExpFormat = '(\\+7)(\\d{3})(\\d{3})(\\d{2})(\\d{2})';
      // const f = (new RegExp(regExpFormat)).exec(phone);
      //
      // return `${f[1]} (${f[2]}) ${f[3]}-${f[4]}-${f[5]}`;
      //
      // так как требуется именно такой способ, то сделаю такой :c
      // но через регулярки мне нравится больше c:
      // ********************************************************************
      let res = '';

      for (let i = 0; i < phone.length; i++) {
        switch (i) {
          case 2: {
            res += ` (${phone.charAt(i)}`;
            break;
          }

          case 5: {
            res += `) ${phone.charAt(i)}`;
            break;
          }

          case 8: case 10: {
            res += `-${phone.charAt(i)}`;
            break;
          }

          default: res += phone.charAt(i);
        }
      }

      return res;
    }
  }

  const phone = prompt('phone', '+71234567890');

  alert(util.formattedPhone(phone)); // +7 (123) 456-78-90
}