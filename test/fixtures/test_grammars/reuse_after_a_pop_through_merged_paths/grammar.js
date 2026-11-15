// Four readings of an erroneous prefix merge inside the second `n0`, and a later pop through the merged
// stack node splits them again. Which of them go on depends on text before that `n0`.

export default grammar({
  name: 'reuse_after_a_pop_through_merged_paths',
  conflicts: $ => [[$.n2], [$.n2, $.n5], [$.n3, $.n5], [$.n2, $.n3], [$.n1, $.n3], [$.n3], [$.n5], [$.n2, $.n3, $.n5], [$.n2, $.n4]],
  rules: {
    source: $ => repeat($.n0),
    n0: $ => seq('z', $.n2, '}', '='),
    n1: $ => seq($.n2, 'z'),
    n2: $ => choice(seq(optional('c'), '{', '{'), seq($.n3, '='), seq('=', repeat($.n2))),
    n3: $ => choice(seq(optional('z'), '{'), seq('z', $.n4, $.n2), prec.dynamic(1, seq($.n2, $.n4, $.n5))),
    n4: $ => choice(seq($.n1, '='), seq($.n5, $.n2, $.n3), seq('y', 'c')),
    n5: $ => choice(prec.dynamic(1, seq('{', optional('='))), '='),
  }
});
