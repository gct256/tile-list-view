import * as React from 'react';

declare namespace TileListView {
  declare class TileListView extends React.Component<TileListViewProps> {}
  interface TileListViewProps {
    items: React.ReactNode[];
    itemWidth: number;
    itemHeight: number;
    selection: number[];
    cursor: number;

    style?: CSS.Properties<string | number>;
    className?: string;
    focusedStyle?: CSS.Properties<string | number>;
    focusedClassName?: string;

    onUpdateSelection?: (selection: number[]) => void;
    onUpdateCursor?: (cursor: number) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
  }
}

export = TileListView;
