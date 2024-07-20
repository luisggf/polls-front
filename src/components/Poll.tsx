import React from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";

const Poll: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto bg-slate-50 rounded-lg shadow-md">
      <div className="text-center mb-4 rounded-md overflow-hidden p-2 bg-slate-900">
        <span role="img" aria-label="pointing-up" className="text-3xl">
          ☝️
        </span>
      </div>
      <RadioGroup.Root className="space-y-4 p-4">
        <RadioGroup.Item
          value="A"
          className="flex items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer w-full"
        >
          <input type="radio" className="hidden" />
          <div className="ml-2 text-gray-700">
            <strong>A.</strong> Seja a energia que deseja atrair.
          </div>
        </RadioGroup.Item>
        <RadioGroup.Item
          value="B"
          className="flex items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer w-full"
        >
          <input type="radio" className="hidden" />
          <div className="ml-2 text-gray-700">
            <strong>B.</strong> O vento sopra sempre a favor dos que sabem o que
            querem
          </div>
        </RadioGroup.Item>
        <RadioGroup.Item
          value="C"
          className="flex items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer w-full"
        >
          <input type="radio" className="hidden" />
          <div className="ml-2 text-gray-700">
            <strong>C.</strong> A perfeição tá no equilíbrio de todas as coisas.
          </div>
        </RadioGroup.Item>
        <RadioGroup.Item
          value="D"
          className="flex items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer w-full"
        >
          <input type="radio" className="hidden" />
          <div className="ml-2 text-gray-700">
            <strong>D.</strong> Seu pensamento cria sua realidade.
          </div>
        </RadioGroup.Item>
      </RadioGroup.Root>
    </div>
  );
};

export default Poll;
