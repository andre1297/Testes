﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.DML
{
    public class Beneficiario
    {
        public int Id { get; set; }

        public string CPF { get; set; }

        public string Nome { get; set; }

        public long IdCliente { get; set; }
    }
}