
class Opt {
    requiredString?: string;
    requiredInt?: number;

    optionalString?: string;
    optionalInt?: number;

    constructor(...options: OptionFn[]) {
        for (const opt of options) {
            opt(this);
        }
    }

    static withRequiredString(requiredString: string): OptionFn {
        return (option: Opt) => {
            option.requiredString = requiredString;
        };
    }

    static withRequiredInt(requiredInt: number): OptionFn {
        return (option: Opt) => {
            option.requiredInt = requiredInt;
        };
    }

    static withOptionalString(optionalString: string): OptionFn {
        return (option: Opt) => {
            option.optionalString = optionalString;
        };
    }

    static withOptionalInt(optionalInt: number): OptionFn {
        return (option: Opt) => {
            option.optionalInt = optionalInt;
        };
    }
}

type OptionFn = (option: Opt) => void;


// Usage example
const option = new Opt(
    Opt.withRequiredString('requiredString'),
    Opt.withRequiredInt(123),
    Opt.withOptionalString('optionalString'),
    Opt.withOptionalInt(456)
);