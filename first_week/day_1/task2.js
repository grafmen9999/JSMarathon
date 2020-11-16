const task2 = () => {
  const util = {
    formattedPhone: (phone) => {
      // ********************************************************************
      // why not? :D
      // const regExpFormat = '(\\+7)?(\\d{3})(\\d{3})(\\d{2})(\\d{2})';
      // const f = (new RegExp(regExpFormat)).exec(phone);
      //
      // return `${f[1] ?? '+7'} (${f[2]}) ${f[3]}-${f[4]}-${f[5]}`;
      //
      // так как требуется именно такой способ, то сделаю такой :c
      // но через регулярки мне нравится больше c:
      // ********************************************************************
      let res = '';
      let q = 0;

      const length = phone.length;

      const firstElem = phone.charAt(0);
      const afterFirstElem = phone.charAt(1);

      if ((firstElem !== '+' && length > 10 && firstElem !== '7' && firstElem !== '8' && firstElem !== '9') || (firstElem === '+' && afterFirstElem !== '7')) {
        throw new Error(`Bad phone number! ${phone}`);
      }

      for (let i = 0; i < length; i++) {
        if (phone.charAt(i) !== '+' && !i) {
          if (length === 10) {
            res += '+7'
            q = 2;
          } else if (length > 10) {
            res += '+7'
            q = 1;
            i++;
          }
        }

        switch (i) {
          case 2 - q: {
            res += ` (${phone.charAt(i)}`;
            break;
          }
          case 5 - q: {
            res += `) ${phone.charAt(i)}`;
            break;
          }

          case 8 - q:
          case 10 - q: {
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

  try {
    alert(util.formattedPhone(phone)); // +7 (123) 456-78-90
  } catch (e) {
    console.error(e);
    alert(e.message)
  }
}