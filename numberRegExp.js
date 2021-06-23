binario
0b(0|1)(_?(0|1))*

hexadecimal
0x[0-9a-fA-F](_?[0-9a-fA-F])*

octal
0o[0-7](_?[0-7])*
  
decimal
\d(_?\d)*((\.\d(_?\d)*)?([eE][-+]?\d(_?\d)*))?

(Infinity|NaN)

unido

(?<binary>0b(0|1)(_?(0|1))*)|(?<hexadecimal>0x[0-9a-fA-F](_?[0-9a-fA-F])*)|(?<octal>0o[0-7](_?[0-7])*)|(?<decimal>\d(_?\d)*((\.\d(_?\d)*)?([eE][-+]?\d(_?\d)*))?)|((?<infinity>Infinity)|(?<nan>NaN))
