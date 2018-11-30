'use strict'

function LogBook(parent, options = {}) {
  this.options = options;

  this.options.width = this.options.width || 1200;
  this.options.height = this.options.height || 580;
  
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

  this.cx.translate(0, 100);

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
    this.cx.lineTo(this.options.width - 100, 40 * (i + 1));
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

  data.forEach(row => {
    this.cx.lineTo(100 + (row.begin * this.options.columnWidth), 40 * row.label + 60);
    this.cx.lineTo(100 + (row.end * this.options.columnWidth), 40 * row.label + 60);
  });

  // this.cx.save();

  // this.cx.font = '26px Monospace';
  // let foraJornada = 0,
  //   emEspera = 0,
  //   emDirecao = 0,
  //   emJornada = 0;
  
  // data.forEach(row => {
  //   if (row.status === LogBook.FORA_JORNADA) {
  //     foraJornada += row.end - row.begin;
  //   } else if (row.status === LogBook.ESPERA) {
  //     emEspera += row.end - row.begin;
  //   } else if (row.status === LogBook.DIRECAO) {
  //     emDirecao += row.end - row.begin;
  //   } else if (row.status === LogBook.JORNADA) {
  //     emJornada += row.end - row.begin;
  //   }
  // });

  // let total = foraJornada + emEspera + emDirecao + emJornada;
  
  // this.cx.fillText(foraJornada, 1070, 60);
  // this.cx.fillText(emEspera, 1070, 120);
  // this.cx.fillText(emDirecao, 1070, 180);
  // this.cx.fillText(emJornada, 1070, 240);
  // this.cx.fillText(total, 1070, 300);

  // this.cx.restore();

  this.cx.stroke();

  // this.cx.beginPath();

  // // this.cx.save();
  // // this.cx.translate(100,300);
  // // this.cx.rotate(-0.5*Math.PI);

  // // var rText = 'Rotated Text';
  // // this.cx.fillText(rText , 0, 280);
  // // this.cx.restore();
  
  // this.cx.strokeStyle = 'black';
  // this.cx.lineWidth = 2;
  // data.forEach(row => {
  //   if (row.hasOwnProperty('location')) {
  //     this.cx.moveTo(100 + (row.begin * (10 * 4)), 250);
  //     this.cx.lineTo(100 + (row.begin * (10 * 4)), 300);
  //     // this.cx.lineTo(100 + (row.begin * (10 * 4)), 430);
  //     this.cx.lineTo(100 + (row.begin * (10 * 4)) - 135, 400);

  //     this.cx.save();
  //     this.cx.font = '16px Monospace';
  //     this.cx.translate(100 + (row.begin * (10 * 4)) - 140, 390);
  //     this.cx.rotate(-0.2*Math.PI);
  //     // this.cx.translate(100 + (row.begin * (10 * 4)) - 10, 430);
  //     // this.cx.rotate(-0.5*Math.PI);
  //     this.cx.fillText(row.location, 0, 0, 175);
  //     this.cx.fillText(row.description, 0, 35, 175);
  //     this.cx.restore();
  //   }
  // });

  // this.cx.stroke();
};

LogBook.prototype.setTitle = function(text) {
  this.cx.save();

  this.cx.translate(0, -100);
  this.cx.font = '26px Monospace';
  
  let width = this.cx.measureText(text).width;
  this.cx.fillText(text, 1200 / 2 - width / 2, 30);

  this.cx.restore();
};

LogBook.prototype.setDate = function(text) {
  this.cx.save();

  this.cx.translate(0, -100);
  this.cx.font = '12px Monospace';
  
  this.cx.fillText(`DATA: ${text}`, 100, 70);

  this.cx.restore();
};

LogBook.prototype.setDriver = function(text) {
  this.cx.save();

  this.cx.translate(0, -100);
  this.cx.font = '12px Monospace';
  
  text = `CONDUTOR: ${text}`;
  let width = this.cx.measureText(text).width;
  this.cx.fillText(text, 1060 - width, 70);

  this.cx.restore();
};