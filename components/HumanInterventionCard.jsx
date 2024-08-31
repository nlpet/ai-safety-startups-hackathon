import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const HumanInterventionCard = ({ options, onDecision }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSubmit = () => {
    if (selectedOption) {
      onDecision(selectedOption);
    }
  };

  return (
    <Card className="mt-2 p-2">
      <CardContent className="p-0">
        <h4 className="text-md font-semibold mb-2">
          Human Intervention Required:
        </h4>
        <RadioGroup onValueChange={setSelectedOption} className="space-y-1">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="text-sm">
                <span className="font-medium">{option.label}</span>
                {option.link && (
                  <a
                    href={option.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline ml-1 inline-flex items-center"
                  >
                    (Details <ExternalLink size={10} className="ml-0.5" />)
                  </a>
                )}
                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="p-0 mt-5">
        <Button
          onClick={handleSubmit}
          disabled={!selectedOption}
          size="sm"
          className="w-full"
        >
          Submit Decision
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HumanInterventionCard;
