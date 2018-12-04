'use strict'

function LogBook(parent, options = {}) {
  this.options = options;

  this.options.width = this.options.width || 1200;
  this.options.height = this.options.height || 580;
  // translate options can se the base position for the chart
  this.options.translate = this.options.translate || { x: 0, y: 0 };
  
  this.options.columnWidth = (this.options.width - 200) / 24;

  if (!this.options.labels) {
    throw 'Labels should be defined';
  }
  this.options.lines = this.options.labels.length;

  this.parent = parent;

  // cria o canvas com as dimensões definidas
  this.canvas = document.createElement('canvas');
  this.canvas.width = options.width;
  this.canvas.height = options.height;
  this.canvas.style.border = '1px solid #cecece';
  this.parent.appendChild(this.canvas);
  
  this.cx = this.canvas.getContext('2d');
  this.cx.beginPath();

  this.cx.lineWidth = 1;
  this.cx.font = '10px Monospace';

  this.cx.translate(this.options.translate.x, this.options.translate.y);

  // labels
  if (this.options.labels) {
    this.options.labels.forEach((label, i) => {
      this.cx.fillText(label, 10, 40 * (i + 1) + 25);

      // cria as constantes para serem usadas nos dados
      LogBook[label] = i;
    });
  }

  // linhas horizontais, onde as linhas significam espaçoes
  for (let i = 0; i <= this.options.lines; i++) {
    this.cx.moveTo(100, 40 * (i + 1));
    if (i > 0) {
      this.cx.lineTo(this.options.width - 20, 40 * (i + 1));
    } else {
      this.cx.lineTo(this.options.width - 100, 40 * (i + 1));
    }
  }

  // linhas das horas
  // this.cx.save();
  // this.cx.translate(100, 0);
  for (let i = 0; i <= 24; i++) {
    let x = this.options.columnWidth * i + 100;

    if (i < 24) {
      let hourString = i.toString();
      if (hourString.length < 2) {
        hourString = '0'+hourString;
      }
      
      // esse cálculo é feito para obter a posição de cada hora
      this.cx.fillText(hourString, x - 4, 30);

      // as horas são subdivididas em todas as linhas
      for (let ii = 0; ii < this.options.lines; ii++) {
        // as horas são subdivididas em 1/4 de hora
        for (let iii = 1; iii < 4; iii++) {
          this.cx.moveTo((this.options.columnWidth / 4) * iii + x, 40 * (ii + 1));
          // a linha do meio 1/2 hora é ligeiramente maior
          if (iii === 2) {
            this.cx.lineTo((this.options.columnWidth / 4) * iii + x, 40 * (ii + 1) + 15);
          } else {
            this.cx.lineTo((this.options.columnWidth / 4) * iii + x, 40 * (ii + 1) + 10);
          }
        }
      }
    }

    // desenha a linha da coluna da hora
    this.cx.moveTo(x, 40);
    this.cx.lineTo(x, 40 * (this.options.lines + 1));
  }
  // this.cx.restore();

  this.cx.stroke();
};

LogBook.prototype.render = function(data) {
  if (data.length < 1) {
    throw 'Array de dados vázio.';
  }

  this.cx.beginPath();

  this.cx.strokeStyle = 'blue';
  this.cx.lineWidth = 5;
  // this.cx.moveTo(100, 50);
  this.cx.moveTo(100, 40 * data[0].label + 60);

  const totais = [];
  let total = 0;
  data.forEach(row => {
    // this.cx.lineTo(100 + (row.begin * this.options.columnWidth), 40 * row.label + 60);
    // this.cx.lineTo(100 + (row.end * this.options.columnWidth), 40 * row.label + 60);
    this.cx.lineTo(100 + (row.begin * this.options.columnWidth), 40 * row.label + 60);
    this.cx.lineTo(100 + (row.end * this.options.columnWidth), 40 * row.label + 60);

    // totalizador dos labels
    if (!totais[row.label]) {
      totais[row.label] = 0;
    }
    totais[row.label] += row.end - row.begin;
    total += row.end - row.begin;
  });

  // time summary
  this.cx.save();
  this.cx.font = '20px Monospace';
  totais.forEach((total, label) => {
    this.cx.fillText(total, this.options.width - 95, 40 * label + 70);
  });
  this.cx.fillText(total, this.options.width - 95, 40 * this.options.lines + 70);
  this.cx.restore();
  this.cx.stroke();

  // line for the total summary
  this.cx.save();
  this.cx.beginPath();
  this.cx.strokeStyle = 'black';
  this.cx.lineWidth = 1;
  this.cx.moveTo(this.options.width - 95, 40 * this.options.lines + 75);
  this.cx.lineTo(this.options.width - 20, 40 * this.options.lines + 75);
  this.cx.stroke();
  this.cx.restore();
};

LogBook.prototype.addText = function(textOpts) {
  textOpts = textOpts || {};
  textOpts.text = textOpts.text || '';
  textOpts.fontSize = textOpts.fontSize || 26;
  textOpts.fontFamily = textOpts.fontFamily || 'Monospace';
  textOpts.x = textOpts.x || 0;
  textOpts.y = textOpts.y || 0;
  textOpts.xBasePos = textOpts.xBasePos || 'left'; // 'left' || 'center' || 'right'

  this.cx.save();

  // sets the translate to the options' opposite, this let the text always at the absolute translate(0, 0)
  this.cx.translate(this.options.translate.x * -1, this.options.translate.y * -1);
  this.cx.font = `${textOpts.fontSize}px ${textOpts.fontFamily}`;
  
  if (textOpts.xBasePos === 'right') {
    let width = this.cx.measureText(textOpts.text).width;
    this.cx.fillText(textOpts.text, textOpts.x - width, textOpts.y);
  } else if (textOpts.xBasePos === 'center') {
    let width = this.cx.measureText(textOpts.text).width;
    this.cx.fillText(textOpts.text, textOpts.x - width / 2, textOpts.y);
  } else {
    this.cx.fillText(textOpts.text, textOpts.x, textOpts.y);
  }

  this.cx.restore();
};