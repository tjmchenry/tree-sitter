// At `,` both versions pause: the first is resumed and the second is removed, and the `n0` reduced
// after that is reduced by one version. With `c` inserted at the start, a fresh parse makes the
// whole text one ERROR, so the `n0` must not be reused.

export default grammar({
    name: 'reuse_after_paused_version_pruning',

    conflicts: $ => [[$.n1, $.n5], [$.n5]],

    rules: {
        source: $ => repeat($.n0),
        n0: $ => seq('{', $.n5),
        n1: $ => choice(seq(';', $.n3, ')', 'c'), seq(optional('z'), 'x')),
        n2: $ => ',',
        n3: $ => seq($.n1, $.n5),
        n4: $ => seq($.n1, $.n2),
        n5: $ => choice(seq('x', ';'), seq(optional(';'), repeat($.n5), $.n4)),
    },
});
