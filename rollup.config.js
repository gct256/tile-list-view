import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

const base = {
  input: './src/TileListView.jsx',
  plugins: [
    nodeResolve({
      extensions: ['.js', '.jsx'],
    }),
    babel(),
  ],
  external: ['react', 'prop-types', 'react-style-proptype'],
};

export default [
  {
    ...base,
    output: {
      file: './index.mjs',
      format: 'es',
    },
  },
  {
    ...base,
    output: {
      file: './index.js',
      format: 'cjs',
      name: 'TileListView',
      globals: {
        react: 'React',
      },
    },
  },
];
