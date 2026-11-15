// Recovery keeps versions alive to the end of the text, and the finished trees' error costs decide
// whether a node keeps a MISSING token or is swallowed into an ERROR.

export default grammar({
  name: 'reuse_after_a_finished_tree_choice',
  conflicts: $ => [[$.n0]],
  rules: {
    source: $ => repeat($.n0),
    n0: $ => choice(seq($.n2, repeat($.n2), $.n2), seq(optional('y'), 'y')),
    n1: $ => seq('b', $.n3, 'b'),
    n2: $ => choice('a', seq('=', $.n1, 'x')),
    n3: $ => prec.dynamic(1, seq('b', '}', $.n2)),
  }
});
