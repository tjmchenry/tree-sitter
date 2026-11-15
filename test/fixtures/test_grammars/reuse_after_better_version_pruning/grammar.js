// At the final `b`, recovery stops trying earlier states because the version that inserted a
// missing `(` is already cheaper, and the `n2` reduced after that is reduced by one version. With
// `b` inserted at the start, that comparison comes out differently, so the `n2` must not be reused.

export default grammar({
    name: 'reuse_after_better_version_pruning',

    conflicts: $ => [[$.n1, $.n2]],

    rules: {
        source: $ => repeat($.n0),
        n0: $ => seq($.n1, $.n1),
        n1: $ => choice(seq($.n2, repeat($.n2), 'z', 'x'), seq(';', $.n2), 'b'),
        n2: $ => choice(seq(';', $.n2), seq(')', $.n2, $.n1), '('),
    },
});
