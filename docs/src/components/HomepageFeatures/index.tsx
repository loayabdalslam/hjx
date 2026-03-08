import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Single File Components',
    Svg: ({ className }) => <div className={className} style={{ fontSize: '4rem', textAlign: 'center' }}>📄</div>,
    description: (
      <>
        Write HTML, CSS, and JavaScript in one .hjx file. No more jumping between multiple files.
      </>
    ),
  },
  {
    title: 'Zero Dependencies',
    Svg: ({ className }) => <div className={className} style={{ fontSize: '4rem', textAlign: 'center' }}>📦</div>,
    description: (
      <>
        Compiles to clean, dependency-free HTML, CSS, and JavaScript. Runs anywhere.
      </>
    ),
  },
  {
    title: 'Reactive State',
    Svg: ({ className }) => <div className={className} style={{ fontSize: '4rem', textAlign: 'center' }}>⚡</div>,
    description: (
      <>
        Built-in state management with automatic UI updates when state changes.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
