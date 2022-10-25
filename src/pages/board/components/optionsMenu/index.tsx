import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { CANVAS_ELE_TYPE, CommonWidth } from '@/utils/constants';
import { PaintBoard } from '@/utils/paintBoard';
import UndoIcon from '@/components/icons/undo';
import RedoIcon from '@/components/icons/redo';
import SaveIcon from '@/components/icons/save';
import CleanIcon from '@/components/icons/clean';
import PenIcon from '@/components/icons/pen';
import EraserIcon from '@/components/icons/eraser';

import styles from './index.module.css';

interface IProps {
  board: PaintBoard | undefined; // 画板
  optionsType: string; // 操作类型
  setOptionsType: (type: string) => void; // 修改操作类型
}

/**
 * 操作面板
 */
const OptionsCard: React.FC<IProps> = ({ board, optionsType, setOptionsType }) => {
  // 刷新操作栏
  const [, setRefresh] = useState(0);
  // 颜色输入框(目前是只读数据)
  const colorInput = useMemo(() => {
    if (board?.currentLineColor) {
      return board.currentLineColor.split('#')[1] || '';
    }
    return '';
  }, [board?.currentLineColor]);

  // 改变画笔颜色
  const changeLineColor = (color: string) => {
    if (board) {
      board.setLineColor(color);
      setRefresh((v) => v + 1);
    }
  };

  // 点击后退
  const undo = () => {
    if (board) {
      board.undo();
    }
  };

  // 点击前进
  const redo = () => {
    if (board) {
      board.redo();
    }
  };

  // 清除画布
  const clean = () => {
    if (board) {
      board.clean();
    }
  };

  // 保存图片
  const saveImage = () => {
    if (board) {
      board.saveImage();
    }
  };

  // 改变宽度
  const setWidth = (w: number) => {
    if (board) {
      switch (optionsType) {
        case CANVAS_ELE_TYPE.FREE_LINE:
          board.setLineWidth(w);
          break;
        case CANVAS_ELE_TYPE.CLEAN_LINE:
          board.setCleanWidth(w);
          break;
        default:
          break;
      }
      setRefresh((v) => v + 1);
    }
  };

  return (
    <div className={styles.optionMenu}>
      <div className="flex">
        {/* 类型切换 */}
        <div className={styles.btnGroup}>
          <div
            className={classNames(styles.btn, {
              [styles.btnActive]: optionsType === CANVAS_ELE_TYPE.FREE_LINE,
            })}
            onClick={() => setOptionsType(CANVAS_ELE_TYPE.FREE_LINE)}
          >
            <PenIcon />
          </div>
          <div
            className={classNames(styles.btn, {
              [styles.btnActive]: optionsType === CANVAS_ELE_TYPE.CLEAN_LINE,
            })}
            onClick={() => setOptionsType(CANVAS_ELE_TYPE.CLEAN_LINE)}
          >
            <EraserIcon />
          </div>
        </div>
        {/* 颜色设置 */}
        {optionsType === CANVAS_ELE_TYPE.FREE_LINE && (
          <div className="form-control ml-3">
            <div className="w-8 h-8 mr-2">
              <input
                type="color"
                value={`#${colorInput}`}
                onChange={(e) => {
                  changeLineColor(e.target.value);
                }}
                className={styles.lineColor}
              />
            </div>
          </div>
        )}
      </div>
      {/* 宽度设置 */}
      <div className="mt-3">
        <div className="font-bold">width</div>
        <div className={styles.btnGroup}>
          {Object.values(CommonWidth).map((w) => (
            <button
              key={w}
              className={classNames(styles.btn, {
                'p-3': true,
                [styles.btnActive]:
                  optionsType === CANVAS_ELE_TYPE.FREE_LINE
                    ? board?.currentLineWidth === w
                    : board?.cleanWidth === w,
              })}
              onClick={() => setWidth(w)}
            >
              <div
                className="rounded-2xl bg-black"
                style={{
                  height: `${w / 2}px`,
                  width: '30px',
                }}
                key={w}
              ></div>
            </button>
          ))}
        </div>
      </div>
      {/* 操作画板 */}
      <div className="mt-3">
        <div className="font-bold">tool</div>
        <ul className="menu menu-horizontal bg-base-100 rounded-box justify-between mt-1">
          <li>
            <a onClick={undo}>
              <div className="tooltip" data-tip="后退">
                <UndoIcon />
              </div>
            </a>
          </li>
          <li>
            <a onClick={redo}>
              <div className="tooltip" data-tip="前进">
                <RedoIcon />
              </div>
            </a>
          </li>
          <li>
            <a onClick={clean}>
              <div className="tooltip" data-tip="清除画布">
                <CleanIcon />
              </div>
            </a>
          </li>
          <li>
            <a onClick={saveImage}>
              <div className="tooltip" data-tip="导出为图片">
                <SaveIcon />
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OptionsCard;
