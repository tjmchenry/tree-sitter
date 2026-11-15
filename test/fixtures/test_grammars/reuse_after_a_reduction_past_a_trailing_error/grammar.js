// In `xzyxxzyzyzzzzyzy;zyx`, a version recovering at the first `y` returns to the state before the
// second `zy` and reduces `zy x x` to `n1`, with its ERROR as a trailing extra. That reduction pops
// past the stack node the inner `n1` is later reduced from, and where it leads depends on the `x`
// before it.

export default grammar({
  name: 'reuse_after_a_reduction_past_a_trailing_error',
  conflicts: $ => [[$.n1, $.n2, $.n5], [$.n2, $.n5], [$.n1], [$.n1, $.n2], [$.n4, $.n5], [$.n2, $.n4, $.n5], [$.n3, $.n5], [$.n2, $.n3, $.n5], [$.n3, $.n4]],
  rules: {
    source: $ => repeat($.n0),
    n0: $ => choice(seq($.n5, $.n1, $.n5), seq($.n1, repeat($.n4), $.n3, ')'), prec.dynamic(1, seq($.n1, 'y', $.n1))),
    n1: $ => choice(seq(optional('zy'), $.n2, optional('y'), 'zy'), prec.dynamic(1, seq(repeat($.n2), optional('zy'), 'x', 'x'))),
    n2: $ => choice(seq('x', 'x', $.n1, ';'), prec.dynamic(1, seq('z', $.n5, optional('z'), 'zy'))),
    n3: $ => choice(prec.dynamic(1, $.n5), seq($.n3, $.n2, 'x'), seq($.n2, 'y', ';', $.n1), 'z'),
    n4: $ => choice(seq($.n4, ')'), prec.dynamic(-1, seq($.n4, optional('y'), ';', $.n3)), 'x'),
    n5: $ => choice(prec.dynamic(-1, 'z'), 'x'),
  }
});
