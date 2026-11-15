// A version that reduces the `}` at byte 10 together with what precedes it dies at `yz`, so the `n4` that
// starts at that `}` is reduced by one version. With `c` inserted, that version survives and wins.

export default grammar({
  name: 'reuse_after_a_version_read_below_its_start',
  conflicts: $ => [[$.n4], [$.n0, $.n4], [$.n0, $.n2], [$.n2], [$.n3, $.n4], [$.n1]],
  rules: {
    source: $ => repeat($.n0),
    n0: $ => choice(seq(optional('c'), $.n2, 'yz'), seq('x', $.n1, '}'), seq($.n4, 'a')),
    n1: $ => choice(seq(repeat($.n1), optional('c'), '(', 'c'), seq('c', 'a', $.n1), 'a'),
    n2: $ => choice(seq('(', $.n3), seq('c', repeat($.n2), $.n2, repeat($.n3)), prec.dynamic(1, 'yz'), '}'),
    n3: $ => choice(prec.dynamic(2, $.n4), '}', '('),
    n4: $ => choice(seq('}', 'x', '(', $.n2), seq(optional('x'), $.n4, $.n3), 'x'),
  }
});
