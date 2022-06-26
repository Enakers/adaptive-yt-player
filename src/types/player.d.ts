type InputMethod = 'switch' | 'mouse' | 'touch' | 'eye gaze';
type InputSize = 'sm' | 'md' | 'lg';

interface InputOptions {
  method?: InputMethod;
  size: InputSize;
  dwellTime: number;
  fixedPosition: boolean;
}
